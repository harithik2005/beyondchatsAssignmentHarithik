import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error.message);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>BeyondChats Articles</h1>
      {!selectedArticle && (
        <p style={{ color: "#555", marginBottom: "20px" }}>
          👉 Click an article to view details
        </p>
      )}

      {articles.length === 0 && <p>No articles found.</p>}

      <ul style={{ lineHeight: "1.8" }}>
        {articles.map((article) => (
          <li
            key={article._id}
            style={{ marginBottom: "12px", cursor: "pointer" }}
            onClick={() => setSelectedArticle(article)}
          >
            <strong>{article.title}</strong>
            <br />
            <span>
              Status: {article.isUpdated ? "AI Updated ✅" : "Original ❌"}
            </span>
          </li>
        ))}
      </ul>

      {selectedArticle && (
        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid #ccc",
            paddingTop: "20px",
          }}
        >
          <button onClick={() => setSelectedArticle(null)}>Close</button>

          <h2>{selectedArticle.title}</h2>

          <p>
            <strong>Status:</strong>{" "}
            {selectedArticle.isUpdated ? "AI Updated" : "Original"}
          </p>

          <h3>Content</h3>
          <p style={{ whiteSpace: "pre-line" }}>
            {selectedArticle.contentText}
          </p>

          {selectedArticle.isUpdated &&
            selectedArticle.references?.length > 0 && (
              <>
                <h3>References</h3>
                <ul>
                  {selectedArticle.references.map((ref, index) => (
                    <li key={index}>
                      <a href={ref} target="_blank" rel="noreferrer">
                        {ref}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
        </div>
      )}
    </div>
  );
}

export default App;
