function Child(props) {
  return (
    <>
      <p>name: {props.name}</p>
      <p>age: {props.age}</p>
    </>
  );
}

function Parent() {
  return (
    <Child />
  );
}

function App() {
  return (
    <>
      <Parent name="Abhey" age={20}  />
    </>
  );
}

export default App;
