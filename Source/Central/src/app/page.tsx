"use client";

import { Header, HeaderName, Theme } from "@carbon/react";

export default function Home() {
  return (
    <Theme theme={'g100'}>
      <Header aria-label="IBM Platform Name">
        <HeaderName href="#" prefix="IBM">
          [Platform]
        </HeaderName>
      </Header>
    </Theme>
  );
}
