import ClientPage from './ClientPage'; export function generateStaticParams() { return [{ slug: '1' }]; } export default function Page() { return <ClientPage />; }
