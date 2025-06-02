 // Lida com a tecla pressionada
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>,func : ()=>void) => {
    if (e.key === 'Enter') {
      func();
    }
  };

  export default handleKeyDown