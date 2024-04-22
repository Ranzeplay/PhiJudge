import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main className={clsx('min-h-screen flex items-center justify-between container')}>
        <div className={clsx('flex flex-col -translate-y-8')}>
          <h1 className={clsx('text-3xl font-serif')}>Welcome to PhiJudge</h1>
          <h4 className={clsx('font-normal -mt-3')}>{siteConfig.tagline}</h4>
          <div className={clsx('flex flex-row gap-x-3')}>
            <Link to={'/docs/intro'}>Learn more</Link>
            <Link to={'https://github.com/Ranzeplay/PhiJudge'}>GitHub</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
