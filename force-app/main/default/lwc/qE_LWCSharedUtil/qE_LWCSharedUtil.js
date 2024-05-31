import { LightningElement, api } from 'lwc';
//import GetDebugFlag from '@salesforce/apex/QE_CLUtility2.GetDebugFlag';
import util from "vlocity_ins/utility";






//export  class qE_LWCSharedUtil extends LightningElement{




 var getDebugFlagRec = {
                type: "ApexRemote",
                value: {
                  className: "QE_CLUtility2",
                  methodName: "GetDebugFlag",
                  inputMap: {

                  },
                  optionsMap: {}
                }
              };


function GetDebugFlag()
{

console.log('Calling Get flag');
    util.getDataHandler(JSON.stringify(getDebugFlagRec))
        .then( result =>{
             let obj = JSON.parse(result);
            console.log('FLAG:' + result);
            resolve(obj.DEBUG);
                return obj.DEBUG;

            })
        .catch( (err) =>{

            return false;

        });

};


var _debug;

function DEBUG1()
{

    if(_debug ==undefined || _debug ==null)
    {
        console.log('Get Flag:' + _debug);



        util.getDataHandler(JSON.stringify(getDebugFlagRec))
            .then( result =>{
                let obj = JSON.parse(result);

                _debug = obj.DEBUG;
                console.log('Get Inside After:' + _debug);
                //  return obj.DEBUG;
                    resolve();
                })
            .catch( (err) =>{

                _debug= false;

            });
    }





     console.log('Get Flag After:' + _debug);
    return _debug;
}



  function GetDebugFlag2()
{


console.log('Calling Get flag');
     util.getDataHandler(JSON.stringify(getDebugFlagRec))
        .then( result =>{
             let obj = JSON.parse(result);
            console.log('FLAG:' + result);
            resolve(obj.DEBUG);
            _debug =obj.DEBUG;
                return obj.DEBUG;

            })
        .catch( (err) =>{

            return false;

        });

};

async function DEBUG()
{


    const result =  await util.getDataHandler(JSON.stringify(getDebugFlagRec));


    return result;

}



const ENABLE_DEBUG = false;
function IS_DEBUG ()
{

  return ENABLE_DEBUG;

}

const DebugSrv ={

    IS_DEBUG:IS_DEBUG,
    DEBUG: DEBUG

};

export { DebugSrv};