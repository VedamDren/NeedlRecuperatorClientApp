export default function(props: any) {

  
    const d = [
      { firstname: "Иван", lastname: "Иванов", midName: "Иванович", age: 20 },
      { firstname: "Анатолий", lastname: "Анатольев", midName: "Анатольевич", age: 21 },
      { firstname: "Алексей", lastname: "Алексеев", midName: "Иванович", age: 22 }
    ]
  
    return (
      <div>
        <>
        {props.superparam}
        {
          d.map((row: Person) => <div>{row.firstname} {row.midName} {row.lastname}</div>)
        }
        </>
      </div>
    )
  }
