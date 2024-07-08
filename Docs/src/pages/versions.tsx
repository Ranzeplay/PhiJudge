import Layout from "@theme/Layout";
import clsx from "clsx";

export default function Versions() {
  return (
    <Layout title="Versions">
      <main className={clsx('min-h-screen flex flex-col container pt-8')}>
        <h1>Versions</h1>
        <ul>
          <li>v0.1</li>
        </ul>
      </main>
    </Layout>
  );
}
