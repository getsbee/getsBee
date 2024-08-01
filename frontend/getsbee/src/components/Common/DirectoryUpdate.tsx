import DirectoryUpdateChild from './DirectoryUpdateChild';

const DirectoryUpdate: React.FC = () => {
  const directories = [
    {
      directoryId: 2,
      name: 'Temporary',
      depth: 1,
      prevDirectoryId: null,
      nextDirectoryId: 3,
      parentDirectoryId: 1,
      memberId: 123,
      children: [],
    },
    {
      directoryId: 3,
      name: 'Bookmark',
      depth: 1,
      prevDirectoryId: 2,
      nextDirectoryId: 4,
      parentDirectoryId: 1,
      memberId: 123,
      children: [],
    },
    {
      directoryId: 4,
      name: 'IT',
      depth: 1,
      prevDirectoryId: 3,
      nextDirectoryId: 9,
      parentDirectoryId: 1,
      memberId: 123,
      children: [
        {
          directoryId: 5,
          name: 'SpringBoot',
          depth: 2,
          prevDirectoryId: null,
          nextDirectoryId: 6,
          parentDirectoryId: 4,
          memberId: 123,
          children: [],
        },
        {
          directoryId: 6,
          name: 'MongoDB',
          depth: 2,
          prevDirectoryId: 5,
          nextDirectoryId: 7,
          parentDirectoryId: 4,
          memberId: 123,
          children: [],
        },
        {
          directoryId: 7,
          name: 'Cloud',
          depth: 2,
          prevDirectoryId: 6,
          nextDirectoryId: 8,
          parentDirectoryId: 4,
          memberId: 123,
          children: [],
        },
        {
          directoryId: 8,
          name: 'BlockChain',
          depth: 2,
          prevDirectoryId: 7,
          nextDirectoryId: null,
          parentDirectoryId: 4,
          memberId: 123,
          children: [],
        },
      ],
    },
    {
      directoryId: 9,
      name: 'Financial Sector',
      depth: 1,
      prevDirectoryId: 4,
      nextDirectoryId: 13,
      parentDirectoryId: 1,
      memberId: 123,
      children: [
        {
          directoryId: 10,
          name: 'Bank',
          depth: 2,
          prevDirectoryId: null,
          nextDirectoryId: 11,
          parentDirectoryId: 9,
          memberId: 123,
          children: [],
        },
        {
          directoryId: 11,
          name: 'Insurance',
          depth: 2,
          prevDirectoryId: 10,
          nextDirectoryId: 12,
          parentDirectoryId: 9,
          memberId: 123,
          children: [],
        },
        {
          directoryId: 12,
          name: 'New Service',
          depth: 2,
          prevDirectoryId: 11,
          nextDirectoryId: null,
          parentDirectoryId: 9,
          memberId: 123,
          children: [],
        },
      ],
    },
    {
      directoryId: 13,
      name: "What's new",
      depth: 1,
      prevDirectoryId: 9,
      nextDirectoryId: null,
      parentDirectoryId: 1,
      memberId: 123,
      children: [
        {
          directoryId: 14,
          name: 'IT',
          depth: 2,
          prevDirectoryId: null,
          nextDirectoryId: 15,
          parentDirectoryId: 13,
          memberId: 123,
          children: [],
        },
        {
          directoryId: 15,
          name: 'Service',
          depth: 2,
          prevDirectoryId: 14,
          nextDirectoryId: null,
          parentDirectoryId: 13,
          memberId: 123,
          children: [],
        },
      ],
    },
  ];

  const user = {
    name: 'Hong BoemSun',
  };

  const filteredDirectories = directories.filter(
    (directory) => directory.name !== 'Temporary' && directory.name !== 'Bookmark',
  );

  return (
    <div className="mt-3 flexflex-col items-start px-8 overflow-y-auto">
      <div className="text-[20px] font-bold" style={{ color: '#253746' }}>
        {user.name}&apos;s
      </div>
      {filteredDirectories.map((directory) => (
        <DirectoryUpdateChild key={directory.directoryId} directory={directory} />
      ))}
    </div>
  );
};

export default DirectoryUpdate;
