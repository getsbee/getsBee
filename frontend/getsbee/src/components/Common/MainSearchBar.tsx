import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from 'react-router-dom';
import searchIcon from '../../assets/searchIcon.png';

const MainSearchBar: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const isDirectorySearch = location.pathname.includes('directory');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('query');
    if (searchQuery) {
      setValue(searchQuery);
    }
  }, [location.search]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchPath = isDirectorySearch
      ? `/search/directory?query=${encodeURIComponent(value)}`
      : `/search/post?query=${encodeURIComponent(value)}`;

    navigate(searchPath);
    window.location.reload();
    // // submit 로직 추가 필요
    // console.log('Submitted value:', value);
    // // 제출 후 입력 필드를 초기화
    // setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md">
      <InputText
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        placeholder="Search"
        className="border-0 border-b-2 border-gray-300 flex-grow text-center focus:border-yellow-500 focus:ring-0 bg-transparent rounded-none mr-2"
      />
      <Button
        type="submit"
        label=""
        text
        severity="secondary"
        aria-label="Search"
        className="focus:outline-none focus:shadow-none m-0 p-0 flex-shrink-0"
      >
        <img src={searchIcon} alt="Search Icon" className="w-6" />
      </Button>
    </form>
  );
};

export default MainSearchBar;
