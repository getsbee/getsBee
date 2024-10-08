import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { getDirectories, updateDirectories } from '../../api/DirectoryApi';

interface EditableTreeProps {
  memberId: number | null;
}

interface NodeData {
  key: string | number;
  directoryId: string | number;
  name: string;
  depth: number;
  prevDirectoryId: string | number | null;
  nextDirectoryId: string | number | null;
  parentDirectoryId: string | number | null;
  memberId: number;
  children: NodeData[];
}

const EditableDir: React.FC<EditableTreeProps> = ({ memberId }) => {
  const { username } = useParams<{ username: string }>();
  const toast = React.useRef<Toast>(null);

  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [rootDirectoryId, setRootDirectoryId] = useState<string | number | null>(null);

  const confirmDialogStyle = {
    width: '60vw',
    minWidth: '350px',
    maxWidth: '500px',
  };

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        setLoading(true);
        const data = await getDirectories(memberId);
        const filteredData = data.data.filter((node: NodeData) => node.name !== 'Bookmark');
        const nodesWithKeys = filteredData.map((node: NodeData) => ({ ...node, key: node.directoryId }));
        setNodes(nodesWithKeys);
        if (nodesWithKeys.length > 0) {
          setRootDirectoryId(nodesWithKeys[0].parentDirectoryId);
        }
        // Initialize expandedKeys
        const initialExpandedKeys = {};
        nodesWithKeys.forEach((node: NodeData) => {
          initialExpandedKeys[node.key] = false;
        });
        setExpandedKeys(initialExpandedKeys);
      } catch (error) {
        console.error('Failed to fetch directories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectories();
  }, [memberId]);

  const isSpecialDirectory = (name: string) => {
    return name === 'Temporary';
  };

  const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const addNode = (parentId: string | number | null, isSubDirectory: boolean = false) => {
    const newNode: NodeData = {
      key: `T${uuidv4()}`,
      directoryId: `T${uuidv4()}`,
      name: 'New Directory',
      depth: isSubDirectory ? 2 : 1,
      prevDirectoryId: null,
      nextDirectoryId: null,
      parentDirectoryId: isSubDirectory ? parentId : rootDirectoryId,
      memberId: memberId,
      children: [],
    };

    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      if (isSubDirectory && parentId) {
        const parentNode = updatedNodes.find((node) => node.directoryId === parentId);
        if (parentNode && parentNode.depth === 1) {
          if (parentNode.children.length > 0) {
            const lastChild = parentNode.children[parentNode.children.length - 1];
            newNode.prevDirectoryId = lastChild.directoryId;
            lastChild.nextDirectoryId = newNode.directoryId;
          }
          parentNode.children.push(newNode);
          setExpandedKeys((prev) => ({ ...prev, [parentId]: true }));
        }
      } else {
        if (updatedNodes.length > 0) {
          const lastNode = updatedNodes[updatedNodes.length - 1];
          newNode.prevDirectoryId = lastNode.directoryId;
          lastNode.nextDirectoryId = newNode.directoryId;
        }
        updatedNodes.push(newNode);
      }
      return updatedNodes;
    });

    setExpandedKeys((prev) => ({ ...prev, [newNode.key]: false }));
  };

  const deleteNode = (id: string | number) => {
    const nodeToDelete = nodes.find((node) => node.directoryId === id);
    if (nodeToDelete && isSpecialDirectory(nodeToDelete.name)) {
      showToast('warn', 'Action Denied', `The '${nodeToDelete.name}' directory cannot be deleted.`);
      return;
    }

    confirmDialog({
      message: (
        <div>
          <p>디렉토리를 정말 삭제하시겠습니까?</p>
          <p>하위 디렉토리 및 포함된 포스트들도 함께 삭제됩니다.</p>
        </div>
      ),
      header: '디렉토리 삭제',
      icon: 'pi pi-exclamation-triangle',
      style: confirmDialogStyle,
      accept: () => {
        setNodes((prevNodes) => {
          const deleteNodeRecursive = (nodes: NodeData[]): NodeData[] => {
            return nodes.filter((node) => {
              if (node.directoryId === id) {
                return false;
              }
              if (node.children.length > 0) {
                node.children = deleteNodeRecursive(node.children);
              }
              return true;
            });
          };

          const updatedNodes = deleteNodeRecursive(prevNodes);

          // Update prevDirectoryId and nextDirectoryId
          for (let i = 0; i < updatedNodes.length; i++) {
            updatedNodes[i].prevDirectoryId = i > 0 ? updatedNodes[i - 1].directoryId : null;
            updatedNodes[i].nextDirectoryId = i < updatedNodes.length - 1 ? updatedNodes[i + 1].directoryId : null;
          }

          return updatedNodes;
        });

        setExpandedKeys((prev) => {
          const newKeys = { ...prev };
          delete newKeys[id];
          return newKeys;
        });
      },
    });
  };

  const updateNode = (id: string | number, newName: string) => {
    const nodeToUpdate = nodes.find((node) => node.directoryId === id);
    if (nodeToUpdate && isSpecialDirectory(nodeToUpdate.name)) {
      showToast('warn', 'Action Denied', `The name of the '${nodeToUpdate.name}' directory cannot be changed.`);
      return;
    }

    setNodes((prevNodes) => {
      const updateNodeRecursive = (nodes: NodeData[]): NodeData[] => {
        return nodes.map((node) => {
          if (node.directoryId === id) {
            return { ...node, name: newName };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateNodeRecursive(node.children) };
          }
          return node;
        });
      };
      return updateNodeRecursive(prevNodes);
    });
  };

  const flattenNodes = (nodes: NodeData[]): NodeData[] => {
    let flatNodes: NodeData[] = [];
    nodes.forEach((node) => {
      const { children, postCount, memberName, key, ...nodeWithoutExcludedProps } = node;
      const flatNode = {
        ...nodeWithoutExcludedProps,
        children: [], // 항상 빈 배열로 설정
      };
      flatNodes.push(flatNode);
      if (children.length > 0) {
        flatNodes = flatNodes.concat(flattenNodes(children));
      }
    });
    return flatNodes;
  };

  const handleSubmit = () => {
    confirmDialog({
      message: '변경사항을 저장하시겠습니까?',
      header: '디렉토리 수정',
      icon: 'pi pi-exclamation-triangle',
      style: confirmDialogStyle,
      accept: async () => {
        try {
          const flattenedNodes = flattenNodes(nodes);
          console.log(JSON.stringify(flattenedNodes, null, 2));
          await updateDirectories(memberId, flattenedNodes);
          window.location.href = `/myhive/${username}`;
          showToast('success', '성공', '디렉토리 수정에 성공했습니다.');
        } catch (error) {
          console.error('Failed to update directories:', error);
          showToast('error', '실패', '디렉토리 수정에 실패했습니다.');
        }
      },
      reject: () => {
        showToast('info', 'Info', 'Changes were not saved');
      },
    });
  };

  const headerTemplate = (
    <div className="flex justify-end items-center w-full">
      <Button icon="pi pi-plus" className="p-button-rounded text-black p-button-text" onClick={() => addNode(null)} />
    </div>
  );

  const nameTemplate = (node: NodeData) => {
    if (isSpecialDirectory(node.name)) {
      return <span>{node.name}</span>;
    }

    return (
      <InputText
        value={node.name}
        onChange={(e) => updateNode(node.directoryId, e.target.value)}
        className="w-3/4 p-inputtext-sm"
      />
    );
  };

  const actionTemplate = (node: NodeData) => {
    if (isSpecialDirectory(node.name)) {
      return null;
    }

    return (
      <div className="flex justify-end space-x-2">
        {node.depth === 1 && (
          <Button
            icon="pi pi-plus"
            className="p-button-rounded text-black p-button-text"
            onClick={() => addNode(node.directoryId, true)}
          />
        )}
        <Button
          icon="pi pi-trash"
          className="p-button-rounded text-black p-button-text"
          onClick={() => deleteNode(node.directoryId)}
        />
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center">
      <Toast ref={toast} />
      <div className="p-4 w-2/3 max-w-3xl">
        <ConfirmDialog />
        <TreeTable
          value={nodes}
          className="p-treetable-sm"
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
        >
          <Column
            field="name"
            header={() => <div className="pl-3 font-bold text-lg">{`${username}'s directory`}</div>}
            body={nameTemplate}
            expander
            style={{ width: '70%' }}
          />
          <Column header={headerTemplate} body={actionTemplate} style={{ width: '30%' }} />
        </TreeTable>
        <div className="mt-4 flex justify-end">
          <Button
            label="저장하기"
            icon="pi pi-check"
            className="bg-[#FFBF09] border-2 border-[#FFBF09] shadow-none hover:bg-[#E5AB08] font-bold"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EditableDir;
