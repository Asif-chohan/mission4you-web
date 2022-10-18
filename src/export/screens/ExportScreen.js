import React from "react";
import XLSX from "xlsx";
import { getAllPlayers } from "../../helpers/exportHelper";
import { firestore } from "../../config/FirebaseManager";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

dayjs.extend(advancedFormat);
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
          const [result, coachesOfCard] = await getAllPlayers(item);
          if (coachesOfCard && coachesOfCard.length > 0) {
            let wsAll = XLSX.utils.json_to_sheet(coachesOfCard);
            XLSX.utils.book_append_sheet(wb, wsAll, "CoachesOfCard");
          }
          if (item === "playerCards") {
            const dataArr = await playCards(result);

            let wsAll = XLSX.utils.json_to_sheet(dataArr);

            XLSX.utils.book_append_sheet(wb, wsAll, item);
          } else if (item === "cards") {
            const dataArr = await cards(result);

            let wsAll = XLSX.utils.json_to_sheet(dataArr);

            XLSX.utils.book_append_sheet(wb, wsAll, item);
          } else {
            let wsAll = XLSX.utils.json_to_sheet(result);

            XLSX.utils.book_append_sheet(wb, wsAll, item);
          }
          console.log("item 1", item);
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
    <div
      style={{
        marginTop: "30px",
      }}
    >
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

const playCards = async (result) => {
  try {
    let dataArr = await Promise.all(
      result.map(async (pCard, i) => {
        let card = (
          await firestore.collection("cards").doc(pCard.card).get()
        ).data();

        let playerNames = [];
        await Promise.all(
          pCard?.players?.map(async (player, i) => {
            let playerData = (
              await firestore.collection("player").doc(player.id).get()
            ).data();
            if (playerData) {
              playerNames.push(playerData.name);
            }
          })
        );
        console.log("pCard.players2");

        let admin = (
          await firestore.collection("player").doc(pCard.admin).get()
        ).data();

        let overAllDuration = dayjs(pCard.overAllDuration?.toDate()).format(
          "DD.MM.YYYY"
        );
        let createdAt = dayjs(pCard.createdAt?.toDate()).format("DD.MM.YYYY");
        let stuffingPeriod = dayjs(pCard.stuffingPeriod?.toDate()).format(
          "DD.MM.YYYY"
        );
        let doneAt = dayjs(pCard.doneAt?.toDate()).format("DD.MM.YYYY");

        let channels = pCard.channels?.join(", ");
        let players = playerNames?.join(", ");
        let messengerGroup = card?.whatsappgroup || "";
        let notifyArr = Object.keys(pCard.notifyAfter || {});

        let notify = {};
        notifyArr &&
          notifyArr.map((item, i) => {
            let txt = `${item} Notification`;
            let data = `${item} Notification Link`;
            notify[txt] = dayjs(pCard.notifyAfter[item]?.toDate()).format(
              "DD.MM.YYYY"
            );
            notify[data] = card.notifications[item]?.link || "";
          });

        let obj = {
          ...pCard,
          cardTitle: card?.title,
          cardGid: card?.GID,
          overAllDuration: overAllDuration,
          channels: channels,
          players: players,
          createdAt: createdAt,
          stuffingPeriod: stuffingPeriod,
          doneAt: doneAt,
          admin: admin?.name,
          messengerGroup: messengerGroup,
          ...notify,
        };
        delete obj['notifyAfter'];
        return obj;
      })
    );
    console.log("dataArr", dataArr);
    return dataArr;
  } catch (error) {
    console.log("error is this", error);
    let dataArr = [];
    return dataArr;
  }
};

const cards = async (result) => {
  try {
    let dataArr = await Promise.all(
      result.map(async (card, i) => {
        let notification = Object.keys(card?.notifications || {});
        let notify = {};
        notification &&
          notification.map((item, i) => {
            let txt = `${item} Notify After`;
            notify[txt] = card.notifications[item]?.daysAfter;
          });
        let obj = {
          ...card,
          ...notify,
        };
        delete obj['notifications'];
        return obj;
      })
    );
    console.log("dataArr", dataArr);
    return dataArr;
  } catch (error) {
    console.log("error is this", error);
    let dataArr = [];
    return dataArr;
  }
}

export default ExportScreen;
