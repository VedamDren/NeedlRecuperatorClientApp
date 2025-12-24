export default function(props: any) {

  
    const d = [
      { firstname: "Максим", lastname: "Литвинов", midName: "Алексеевич", age: 33 },
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
