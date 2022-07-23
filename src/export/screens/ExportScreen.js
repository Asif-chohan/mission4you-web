import React from "react";
import XLSX from "xlsx";
import { getAllPlayers } from "../../helpers/exportHelper";

const COLLECTION_LIST = [
  "appSettings",
  "area",
  "cards",
  "languages",
  "player",
  "playerCards",
  "stack",
  "userSubs",
];
const ExportScreen = () => {
  const [isLoading, setLoading] = React.useState(false);
  const exportAllCollections = async () => {
    try {
      setLoading(true);
      const wb = XLSX.utils.book_new();
      await Promise.all(
        COLLECTION_LIST.map(async (item, i) => {
          await getAllPlayers(item).then(([result, coachesOfCard]) => {
            if (coachesOfCard && coachesOfCard.length > 0) {
              let wsAll = XLSX.utils.json_to_sheet(coachesOfCard);
              XLSX.utils.book_append_sheet(wb, wsAll, "CoachesOfCard");
            }
            console.log("result is here", result);
            let wsAll = XLSX.utils.json_to_sheet(result);
            console.log("wsAll is here", wsAll);

            XLSX.utils.book_append_sheet(wb, wsAll, item);
          });
        })
      );
      setLoading(false);
      console.log("here------------------------------------------");
      XLSX.writeFile(wb, "export-missionForYou.xlsx");
    } catch (error) {
      setLoading(false);
      console.log("error is here", error);
    }
  };

  return (
    <div style={{
      marginTop: "30px",
    }}>
      <button
        style={{
          marginLeft: 10,
          backgroundColor: "rgb(255, 162, 2)",
          color: "white",
          padding: 10,
          borderRadius: 5,
          border: "none",
        }}
        disabled={isLoading}
        onClick={exportAllCollections}
      >
        {isLoading ? "Loading..." : "Export to Excel"}
      </button>
    </div>
  );
};

export default ExportScreen;
