"use client";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react"; // Import React

import FormSidebar from "@/components/List-boat-form/FormSidebar";
import { FormProvider } from "@/components/List-boat-form/FormProvider";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <FormSidebar />
      <Layout>
        <Content
          style={{
            // padding: 24,
            minHeight: "100vh",
            background: "#FFFFFF",
            fontFamily: "Sk-Modernist",
          }}
        >
          <FormProvider>
            <ToastContainer />
            <div>{children}</div>
          </FormProvider>
        </Content>
      </Layout>
    </Layout>
  );
}
