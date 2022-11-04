import getPodYamls from "./Controllers/getPods"; // calling this should return an array of yamls for each pod
import getPrometheusData from "./Controllers/getPrometheusData";
import createAlert from "./Controllers/createAlert";
import checkForOomkill from "./Controllers/checkForOomkill";
const { exec } = require('child_process')
/*


Pull data every X(15) seconds, calls the correct controllers.
    We have a pod name.
    get memory used
    get memory limits
    get HD used
    get HD limits

    
check the data
    if problem detected, create baby alert and check it against already created alerts in the db. 
        dbController.exists?
    create Alert object if problem detected.
            issue text
            status: new
            container:
            node:
            pod:
            used
        limit
         get historical data   1 hour. 
            get old yaml
            new yaml: empty    


write to DB
*/

//portforward on app opening
//const portForward = () =>
    exec("kubectl --namespace monitoring port-forward prometheus-server-5b87dc7765-sl2zk 9090", (error, stdout, stderr) => {
        if (error) {
        console.log(`error: ${error.message}`);
        return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        // return;
        }
    }
    )

//call getPods to get the list of pods and their associated nodes in an object.
const podsList = getPodYamls();


// getPrometheusData(pod, node)
//iterate through this list and plug the associated pod and node into getPrometheusData (send a complete promQL query) Specifically for DiskFull
//we will receive back the data point from prometheus
//send this data point to checkForDiskFull. If it returns true. We need to build an alert with createAlert.



//iterate through this list and plug the associated pod and node into getPrometheusData (send a complete promQL query) Specifically for NodeBurst
//we will receive back the data point from prometheus
//send this data point to checkForNodeBurst. If it returns true. We need to build an alert with createAlert.




//iterate through this list and plug the associated pod and node into getPrometheusData (send a complete promQL query) Specifically for OomKill
//we will receive back the data point from prometheus
//send this data point to checkForOomkill. If it returns true. We need to build an alert with createAlert.
for(let i = 0; i < podsList.length; i++){
    const memUsage = getPrometheusData(podsList[i].podname, 'container_memory_usage_bytes');
    const memLimit = getPrometheusData(podsList[i].podname, 'container_spec_memory_limit_bytes');
    const needAlert = checkForOomkill(memUsage, memLimit);

    if(needAlert){
        createAlert();
    }
};


//check request vs limit for overallocated resources if we want to do Over allocated resources

