var MmtfIterator=function(){"use strict";function t(t){function o(t){return String.fromCharCode.apply(null,t).replace(/\0/g,"")}function n(t){var o,n,r=0;for(o=0,n=a.numGroups;n>o;++o){for(var s=a.groupList[a.groupTypeList[o]],i=0,e=s.bondOrders.length;e>i;++i)t(r+s.bondIndices[2*i],r+s.bondIndices[2*i+1],s.bondOrders[i]);r+=s.atomInfo.length/2}if(a.bondAtomList)for(o=0,n=a.bondAtomList.length;n>o;o+=2)t(a.bondAtomList[o],a.bondAtomList[o+1],a.bondOrderList?a.bondOrderList[o/2]:null)}function r(t){for(var n=0,r=0,s=a.numGroups;s>r;++r)for(var i=a.groupList[a.groupTypeList[r]],e=0,u=i.atomInfo.length/2;u>e;++e)t(i.atomInfo[2*e].toUpperCase(),i.atomInfo[2*e+1],i.atomCharges[e],a.xCoordList[n],a.yCoordList[n],a.zCoordList[n],a.bFactorList?a.bFactorList[n]:null,a.atomIdList?a.atomIdList[n]:null,a.altLocList?o([a.altLocList[n]]):null,a.occupancyList?a.occupancyList[n]:null),n+=1}function s(t){for(var n=0,r=0,s=a.numGroups;s>r;++r){var i={},e=i.atomInfo.length/2;t(i.groupName,i.singleLetterCode,i.chemCompType,a.groupIdList[r],a.groupTypeList[r],a.secStructList?a.secStructList[r]:null,a.insCodeList?o([a.insCodeList[r]]):null,a.sequenceIdList?a.sequenceIdList[r]:null,n,e),n+=e}}function i(t){for(var n=0,r=0;r<a.numChains;++r){var s=a.groupsPerChain[r];t(o(a.chainIdList.subarray(r,r+4)),a.chainNameList?o(a.chainNameList.subarray(r,r+4)):null,n,s),n+=s}}function e(t){for(var o=0,n=0;n<a.numModels;++n){var r=a.chainsPerModel[n];t(o,r),o+=r}}var a=t;this.eachBond=n,this.eachAtom=r,this.eachGroup=s,this.eachChain=i,this.eachModel=e}return t}();