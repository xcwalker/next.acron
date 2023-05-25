import getDocument from "@/firebase/firestore/getData";

export default function Page({ params }) {
  var userData;

  getDocument("users", params.userID).then(res => {
    userData = res.result
  })

  return <>
    {userData && <>
      <head>
        <title>test title</title>
      </head>
      <section className="user">
        <div className="container">
          <div className="info">
            <h1>{userData.about.firstname} {userData.about.lastname}</h1>
          </div>
        </div>
      </section>
    </>}
  </>;
}