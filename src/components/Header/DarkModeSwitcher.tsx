import useColorMode from "@/hooks/useColorMode";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${
          colorMode === "dark" 
        }`}
      >
        
       
        
      
      </label>
    </li>
  );
};

export default DarkModeSwitcher;
