import React, { useEffect, useState } from "react";

const ViewManuscriptDetails = () => {
  const {journalInfor, setJournalInfo} = useState()
  const fetchManuscriptData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/journal-desc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        const data = response.data.data;
        console.log(response.data);

        setJournalInfo(response.data.journal);

        // Parse figures data
        if (data.figures) {
          try {
            let figuresArray = [];

            if (typeof data.figures === "string") {
              const cleanedString = data.figures.replace(/\\\//g, "/");
              figuresArray = JSON.parse(cleanedString);
            } else if (Array.isArray(data.figures)) {
              figuresArray = data.figures;
            }

            const formattedFigures = figuresArray.map((figureUrl, index) => ({
              id: index + 1,
              image: figureUrl,
              title: `Figure ${index + 1}`,
              description: `Figure ${index + 1} from the manuscript`,
            }));

            setFigures(formattedFigures);
          } catch (parseError) {
            console.error("Error parsing figures:", parseError);
            setFigures([]);
          }
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch manuscript");
      }
    } catch (error) {
      console.error("Error fetching manuscript:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(
        error.response?.data?.message || "Failed to fetch manuscript"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchManuscriptData();
    }
  }, [id]);
  return <div></div>;
};

export default ViewManuscriptDetails;
