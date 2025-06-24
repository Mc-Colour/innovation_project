import React, { useState } from 'react';

const articles = [
    {
        id:1,
        title: "Understanding Equine Obesity",
        summary: "Learn how weight affects a horse's health and performance.",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elementum massa risus, quis ultrices magna dictum vitae. 
        Etiam sit amet blandit sem. Aenean lorem massa, scelerisque ut lacus at, faucibus maximus turpis. 
        Suspendisse accumsan velit et leo mattis condimentum. Donec ut pulvinar ipsum, vel venenatis lorem. 
        Suspendisse sit amet erat tempus, feugiat sapien eu, tincidunt eros. Aenean mauris turpis, sollicitudin nec hendrerit vel, volutpat eu justo.
         Interdum et malesuada fames ac ante ipsum primis in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
         Quisque sed mi sit amet dolor pellentesque rutrum in nec tortor. Mauris id neque mi.`
    },
    {
        id:2,
        title: "Body Condition Scoring",
        summary: "Find out how body condition scoring helps assess a horse's health.",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elementum massa risus, quis ultrices magna dictum vitae. 
        Etiam sit amet blandit sem. Aenean lorem massa, scelerisque ut lacus at, faucibus maximus turpis. 
        Suspendisse accumsan velit et leo mattis condimentum. Donec ut pulvinar ipsum, vel venenatis lorem. 
        Suspendisse sit amet erat tempus, feugiat sapien eu, tincidunt eros. Aenean mauris turpis, sollicitudin nec hendrerit vel, volutpat eu justo.
         Interdum et malesuada fames ac ante ipsum primis in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
         Quisque sed mi sit amet dolor pellentesque rutrum in nec tortor. Mauris id neque mi.`
    }
];

export default function Education() {
    const [expanded, setExpanded] = useState({});
    const toggleExpanded = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div>
            <h2>Education Zone</h2>
            {articles.map((article) => (
                <div key={article.id} style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    margin: "1rem 0",
                    padding: "1rem",
                }}>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>

                    {expanded[article.id] && (
                        <div style={{ marginTop: "0.5rem"}}>
                            <p>{article.content}</p>
                        </div>
                    )}
                    <button onClick={() => toggleExpanded(article.id)}>
                        {expanded[article.id] ? "Show Less" : "Read More"}
                    </button>
                </div>
            ))}
        </div>
    );
}