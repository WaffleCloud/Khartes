import React, { createContext, useContext, useState} from 'react';
import { length } from '../../webpack.config';

// types
export interface AlertObjInterface {
  id: number
  issue: string
  status: string
  node: string
  pod: string
  container: string
  metric: number
  limit: number
  historicalMetrics: number[][]
  oldYaml: string
  newYaml: string
  comments: string[]
}

export type AlertsContextType = {
  clickedAlerts: AlertObjInterface[]
  alerts: AlertObjInterface[];
  fetchAlerts: () => void;
  deleteAlerts: (id: number) => void;
  addAlertObj: (alertObj: AlertObjInterface) => void;
  addAlertObjComment: (alertObj: AlertObjInterface, newComment: string) => void;
  updateStatus: (alertObj: AlertObjInterface) => void;
}

export const DataContext = React.createContext<AlertsContextType>({} as AlertsContextType);
// const AlertsUpdateContext = React.createContext<AlertsContextInterface | null> (null)

export function useDataContext () {
  return useContext(DataContext);
}

// export function useDataUpdateContext () {
//   return useContext(AlertsUpdateContext);
// }

// const defaultAlerts = [
// {
//   id: 1,
//   issue: 'Low Disk Storage',
//   status: 'Pending',
//   node: 'name',
//   pod: 'name',
//   container: 'name',
//   metrics: {limits: 'X variable', data: 'Y variable'},
//   oldYaml: 'blah blah',
//   newYaml: 'blah blah blah'
// },
// {
//   id: 2,
//   issue: 'OOM Kill Warning',
//   status: 'Pending',
//   node: 'name',
//   pod: 'name',
//   container: 'name',
//   metrics: {limits: 'X variable', data: 'Y variable'},
//   oldYaml: 'blah blah',
//   newYaml: 'blah blah blah'
// }
// ]

type Props = {
  children?: React.ReactNode;
};

export const AlertProvider: React.FC<Props> = ({children}) => {
  const [alerts, setAlerts] = React.useState<AlertObjInterface[]>([]); //default data will change to an empty array 
  const [clickedAlerts, addAlert] = React.useState<AlertObjInterface[]>([]);

  //functionality to add Alerts
  const fetchAlerts = ():void => {
    alert("in the fetchAlerts") // fetchinterval pings the server every 30 seconds, until the component unmounts
    fetch('http://localhost:8000/alerts')
      .then(response => response.json()) // refine this, but basically update state with alert list the fetch returns
      .then(data => {
        if (data !== alerts) {
          console.log('received updated alerts');
          setAlerts(data);
          // if(visual.length === 0) {
          //   setVisual(Array(data.length).fill(false));
          // }
        }
      })
      .catch() // error handler
  };

  //functionality to update Alerts, we are receiving an updated alert from visualization page
  // async function updateAlerts (updatedAlertObj: AlertObjInterface) {
  //   alert('reached updateAlerts')
  //   alert(updatedAlertObj)
  //   console.log(updatedAlertObj);

  //   // grabbing the id of the alert and new Status, we can change the status
  //   setAlerts(oldState => {
  //     // creating a copy of old state
  //     let newState = [...oldState];
  //     // mapping the new state and if the id matches, change the status
  //     newState = newState.map((alertObj: AlertObjInterface) => {
  //       if (alertObj.id === updatedAlertObj.id){
  //         alertObj = updatedAlertObj
  //       }
  //       return alertObj;
  //     })
  //     // returning the new state
  //     return newState;
  //   })
  //   console.log(updatedAlertObj)
  //   // console.log(updatedAlertObj); 
  // }

  function deleteAlerts (id: number) {
    alert('made it to deletealerts func');
  setAlerts(oldState => {
    // logic to remove the object with this ID from our old state
    let newState = [...oldState];
    newState = newState.filter(alertObj => {
      if (alertObj.id === id) {
        // before the alert is deleted in the frontend, add to deletedAlerts Array
          // setDeletedAlerts(oldState => {
          //   return [...oldState, alertObj]
          // });
        return false;
    }
      return true;
    })
    return newState;
    })
  }

  function addAlertObj (alertObj: AlertObjInterface){
    const newAlertArr = [...clickedAlerts, alertObj];
    addAlert(newAlertArr);
  }

  function updateStatus (alertObj: AlertObjInterface){
    alert('in update status Alerts')

    if (alertObj.status === 'Pending'){
      alertObj.status = 'New';
    } else {
      alertObj.status = 'Pending';
    }
    alert(alertObj.status);
    
    addAlert(oldState => {
      let newState = [...oldState];
      newState = newState.map(alert => {
        if (alert.id === alertObj.id){
          alert.status = alertObj.status;
        }
        return alert;
      })
      return newState;
      });
      console.log(alertObj);
      //update the database
      fetch(`http://localhost:8000/alerts/${alertObj.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertObj)
      })
        .then(()=> {
          console.log("made it back, updated database")
          // updateAlerts(newAlertObj);
        })
        .catch((err) => {
          console.log('There was an error in updateAlerts fetch request.');
          console.log(err);
        }
        )
  }

   function addAlertObjComment (alertObj: AlertObjInterface, newComment: string){
    alert('in add Comment Alerts')
    const allComments = [...alertObj.comments, newComment];
    alertObj.comments = allComments;
    // console.log(updatedAlerts[id].comments)
    alert(allComments);
    addAlert(oldState => {
      let newState = [...oldState];
      newState = newState.map(alert => {
        if (alert.id === alertObj.id){
          alert.comments = allComments;
        }
        return alert;
      })
      return newState;
      });

      //update the database
      console.log(alertObj);
      alert(alertObj);
      fetch(`http://localhost:8000/alerts/${alertObj.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertObj)
      })
        .then(()=> {
          console.log("made it back, updated database")
          // updateAlerts(newAlertObj);
        })
        .catch((err) => {
          console.log('There was an error in updateAlerts fetch request.');
          console.log(err);
        }
        )
  }

  return (
    <DataContext.Provider value= {{clickedAlerts, alerts, fetchAlerts, deleteAlerts, addAlertObj, updateStatus, addAlertObjComment}}>
        {children}
    </DataContext.Provider>
  )
}

export default AlertProvider;