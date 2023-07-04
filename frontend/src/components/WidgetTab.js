const WidgetTab = ({ title, isActive, onClick, children }) => {
  return (
    <div>
      <TabButton isActive={isActive} onClick={onClick}>{title}</TabButton>
      {isActive && children}
    </div>
  );
};

export default WidgetTab;