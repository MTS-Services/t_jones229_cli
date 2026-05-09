// components/Private-charterTab/TabListUI.tsx
import { ConfigProvider, Tabs } from "antd";
import type { TabsProps } from "antd";

interface TabListUIProps {
  activeKey: string;
  onTabChange: (key: string) => void;
}

const TabListUI: React.FC<TabListUIProps> = ({ activeKey, onTabChange }) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All",
    },
    {
      key: "2",
      label: "Price (Highest)",
    },
    {
      key: "3",
      label: "Price (Lowest)",
    },
  ];

  return (
    <div className="w-full">
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemHoverColor: "#242424",
              colorPrimary: "#3D53F5",
              colorText: "#242424",
              itemColor: "#878787",
              itemSelectedColor: "#242424",
              fontSize: 16,
            },
          },
        }}
      >
        <Tabs activeKey={activeKey} items={items} onChange={onTabChange} />
      </ConfigProvider>
    </div>
  );
};

export default TabListUI;
