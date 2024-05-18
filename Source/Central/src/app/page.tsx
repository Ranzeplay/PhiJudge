"use client";

import { RootNavBar } from "@/components/nav/rootNavBar";
import { Content, Heading } from "@carbon/react";

export default function Home() {
  return (
    <>
      <RootNavBar />
      <Content>
        <Heading>Welcome to PhiJudge</Heading>
      </Content>
    </>
  );
}
