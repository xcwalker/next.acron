export default function Page({ params }) {
    return <>
        media
    </>
}

export async function generateMetadata({ params }) {
    // const userData = await getServerSideProps(params)

    return {
        title: "Media | Acron",
    };
}