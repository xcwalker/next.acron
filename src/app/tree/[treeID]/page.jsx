import { RelativeLink } from "@/RelativeLink";

export default function Page({ params }) {
    return <>
        <h1>Tree Page: {params.treeID}</h1>
        <RelativeLink href={"/edit"}>Edit</RelativeLink>
    </>;
  }