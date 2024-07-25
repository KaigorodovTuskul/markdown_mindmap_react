const ButtonPanel = ({ onAddHeading, onAddNode, onAddCheckBoxTrue, onAddCheckBoxFalse}) => {
  return (
    <div className="button-panel">
      <button onClick={onAddHeading}>Add header</button>
      <button onClick={onAddNode}>Add node</button>
      <button onClick={onAddCheckBoxTrue}>Add true checkbox</button>
      <button onClick={onAddCheckBoxFalse}>Add false checkbox</button>
    </div>
  );
};

export default ButtonPanel;
