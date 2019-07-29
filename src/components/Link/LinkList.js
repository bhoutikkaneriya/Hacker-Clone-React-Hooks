import React, { useState } from 'react';
import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';

function LinkList(props) {
  const { firebase } = React.useContext(FirebaseContext);
  const [links, setLinks] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const isNewPage = props.location.pathname.includes('new');

  React.useEffect(() => {
    getLinks();
  }, []);

  function getLinks() {
    setLoading(true);
    firebase.db
      .collection('links')
      .orderBy('created', 'desc')
      .onSnapshot(handleSnapshot);
    setLoading(false);
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    setLinks(links);
    setLoading(false);
  }

  function renderLinks() {
    if (isNewPage) {
      return links;
    }
    const topLinks = links
      .slice()
      .sort((l1, l2) => l2.votes.length - l1.votes.length);
    return topLinks;
  }

  return (
    <div style={{ opacity: loading ? 0.25 : 1 }}>
      {renderLinks().map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + 1}
        />
      ))}
    </div>
  );
}

export default LinkList;
