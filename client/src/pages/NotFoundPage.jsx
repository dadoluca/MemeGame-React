import PageContent from '../components/PageContent';

export default function NotFound() {
    const title = 'Nothing to see here...';
    const subtitle = 'This is not the page you are looking for!';
    return(
        <PageContent title={title}>
            <p>{subtitle}</p>
        </PageContent>
    );
}