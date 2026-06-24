import ClientPage from './ClientPage'; export function generateStaticParams() { return [{ slug: '1' }]; } export default function Page({ params }: any) { return <ClientPage params={params} />; }
