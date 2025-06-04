import DeveloperList from "@/components/DeveloperList";
import { Button, Flex, Input, QRCode } from "antd";

const DocsPage = () => {
  
  const c: Person = { firstname: "Максим", lastname: "Литвинов", midName: "Алексеевич", age: 32 };

  return (
    <div>
      <p>Автор - {c.firstname} {c.midName} {c.lastname}</p>
      <DeveloperList superparam="Супер текст"/>


      <Input />
      <Flex gap="small" wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </Flex>
      <QRCode value="https://www.kinopoisk.ru/film/38653/?utm_referrer=www.google.com"/>
    </div>
  );
};

export default DocsPage;
 