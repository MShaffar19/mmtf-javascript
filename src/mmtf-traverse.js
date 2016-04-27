/**
 * @file mmtf-traverse
 * @private
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

/**
 * mmtf traverse module.
 * @module MmtfTraverse
 */

/**
 * Converts an array of ASCII codes trimming '\0' bytes
 * @private
 * @param  {Array} charCodeArray - array of ASCII char codes
 * @return {String} '\0' trimmed string
 */
function fromCharCode( charCodeArray ){
    return String.fromCharCode.apply( null, charCodeArray ).replace(/\0/g, '');
}


/**
 * @callback module:MmtfTraverse.onModel
 * @param {Object} modelData
 * @param {Integer} modelData.chainCount
 * @param {Integer} modelData.modelIndex
 */

/**
 * @callback module:MmtfTraverse.onChain
 * @param {Object} chainData
 * @param {Integer} chainData.groupCount
 * @param {Integer} chainData.chainIndex
 * @param {Integer} chainData.modelIndex
 * @param {String} chainData.chainId
 * @param {?String} chainData.chainName
 */

/**
 * @callback module:MmtfTraverse.onGroup
 * @param {Object} groupData
 * @param {Integer} groupData.atomCount
 * @param {Integer} groupData.groupIndex
 * @param {Integer} groupData.chainIndex
 * @param {Integer} groupData.modelIndex
 * @param {Integer} groupData.groupId
 * @param {Integer} groupData.groupType
 * @param {String} groupData.groupName
 * @param {Char} groupData.singleLetterCode
 * @param {String} groupData.chemCompType
 * @param {?Integer} groupData.secStruct - encoding
 *    0: pi helix, 1: bend, 2: alpha helix, 3: extended,
 *    4: 3-10 helix, 5: bridge, 6: turn, 7: coil, -1: undefined
 * @param {?Char} groupData.insCode
 * @param {?Integer} groupData.sequenceIndex
 */

/**
 * @callback module:MmtfTraverse.onAtom
 * @param {Object} atomData
 * @param {Integer} atomData.atomIndex
 * @param {Integer} atomData.groupIndex
 * @param {Integer} atomData.chainIndex
 * @param {Integer} atomData.modelIndex
 * @param {Integer} atomData.atomId
 * @param {String} atomData.element
 * @param {String} atomData.atomName
 * @param {Integer} atomData.atomCharge
 * @param {Float} atomData.xCoord
 * @param {Float} atomData.yCoord
 * @param {Float} atomData.zCoord
 * @param {?Float} atomData.bFactor
 * @param {?Char} atomData.altLoc
 * @param {?Float} atomData.occupancy
 */

/**
 * @callback module:MmtfTraverse.onBond
 * @param {Object} bondData
 * @param {Integer} bondData.atomIndex1
 * @param {Integer} bondData.atomIndex2
 * @param {Integer} bondData.bondOrder
 */


/**
 * Traverse the MMTF structure data.
 * @static
 * @param {module:MmtfDecode.MmtfData} mmtfData - decoded mmtf data
 * @param {Object} eventCallbacks
 * @param {module:MmtfTraverse.onModel} [eventCallbacks.onModel] - called for each model
 * @param {module:MmtfTraverse.onChain} [eventCallbacks.onChain] - called for each chain
 * @param {module:MmtfTraverse.onGroup} [eventCallbacks.onGroup] - called for each group
 * @param {module:MmtfTraverse.onAtom} [eventCallbacks.onAtom] - called for each atom
 * @param {module:MmtfTraverse.onBond} [eventCallbacks.onBond] - called for each bond
 * @param {Object} [params] - traversal parameters
 * @param {Boolean} [params.firstModelOnly] - traverse only the first model
 */
function traverseMmtf( mmtfData, eventCallbacks, params ){

    params = params || {};

    var firstModelOnly = params.firstModelOnly;

    // setup callbacks
    var onModel = eventCallbacks.onModel;
    var onChain = eventCallbacks.onChain;
    var onGroup = eventCallbacks.onGroup;
    var onAtom = eventCallbacks.onAtom;
    var onBond = eventCallbacks.onBond;

    // setup index counters
    var modelIndex = 0;
    var chainIndex = 0;
    var groupIndex = 0;
    var atomIndex = 0;

    var modelFirstAtomIndex = 0;
    var modelLastAtomIndex = -1;

    // setup optional fields
    var chainNameList = mmtfData.chainNameList;
    var secStructList = mmtfData.secStructList;
    var insCodeList = mmtfData.insCodeList;
    var sequenceIndexList = mmtfData.sequenceIndexList;
    var atomIdList = mmtfData.atomIdList;
    var bFactorList = mmtfData.bFactorList;
    var altLocList = mmtfData.altLocList;
    var occupancyList = mmtfData.occupancyList;
    var bondAtomList = mmtfData.bondAtomList;
    var bondOrderList = mmtfData.bondOrderList;

    // hoisted loop variables
    var o, ol, i, j, k, kl;

    // loop over all models
    for( o = 0, ol = mmtfData.chainsPerModel.length; o < ol; ++o ){

        if( firstModelOnly && modelIndex > 0 ) break;

        var modelChainCount = mmtfData.chainsPerModel[ modelIndex ];

        if( onModel ){
            onModel({
                chainCount: modelChainCount,
                modelIndex: modelIndex
            });
        }

        for( i = 0; i < modelChainCount; ++i ){

            var chainGroupCount = mmtfData.groupsPerChain[ chainIndex ];
            if( onChain ){
                var chainId = fromCharCode(
                    mmtfData.chainIdList.subarray( chainIndex * 4, chainIndex * 4 + 4 )
                );
                var chainName = null;
                if( chainNameList ){
                    chainName = fromCharCode(
                        chainNameList.subarray( chainIndex * 4, chainIndex * 4 + 4 )
                    );
                }
                onChain({
                    groupCount: chainGroupCount,
                    chainIndex: chainIndex,
                    modelIndex: modelIndex,
                    chainId: chainId,
                    chainName: chainName
                });
            }

            for( j = 0; j < chainGroupCount; ++j ){

                var groupData = mmtfData.groupList[ mmtfData.groupTypeList[ groupIndex ] ];
                var groupAtomCount = groupData.atomNameList.length;
                if( onGroup ){
                    var secStruct = null;
                    if( secStructList ){
                        secStruct = secStructList[ groupIndex ];
                    }
                    var insCode = null;
                    if( mmtfData.insCodeList ){
                        insCode = String.fromCharCode( insCodeList[ groupIndex ] );
                    }
                    var sequenceIndex = null;
                    if( sequenceIndexList ){
                        sequenceIndex = sequenceIndexList[ groupIndex ];
                    }
                    onGroup({
                        atomCount: groupAtomCount,
                        groupIndex: groupIndex,
                        chainIndex: chainIndex,
                        modelIndex: modelIndex,
                        groupId: mmtfData.groupIdList[ groupIndex ],
                        groupType: mmtfData.groupTypeList[ groupIndex ],
                        groupName: groupData.groupName,
                        singleLetterCode: groupData.singleLetterCode,
                        chemCompType: groupData.chemCompType,
                        secStruct: secStruct,
                        insCode: insCode,
                        sequenceIndex: sequenceIndex
                    });
                }

                for( k = 0; k < groupAtomCount; ++k ){

                    if( onAtom ){
                        var atomId = null;
                        if( atomIdList ){
                            atomId = atomIdList[ atomIndex ];
                        }
                        var bFactor = null;
                        if( bFactorList ){
                            bFactor = bFactorList[ atomIndex ];
                        }
                        var altLoc = null;
                        if( altLocList ){
                            altLoc = String.fromCharCode( altLocList[ atomIndex ] );
                        }
                        var occupancy = null;
                        if( occupancyList ){
                            occupancy = occupancyList[ atomIndex ];
                        }
                        onAtom({
                            atomIndex: atomIndex,
                            groupIndex: groupIndex,
                            chainIndex: chainIndex,
                            modelIndex: modelIndex,
                            atomId: atomId,
                            element: groupData.elementList[ k ],
                            atomName: groupData.atomNameList[ k ],
                            atomCharge: groupData.atomChargeList[ k ],
                            xCoord: mmtfData.xCoordList[ atomIndex ],
                            yCoord: mmtfData.yCoordList[ atomIndex ],
                            zCoord: mmtfData.zCoordList[ atomIndex ],
                            bFactor: bFactor,
                            altLoc: altLoc,
                            occupancy: occupancy
                        });
                    }

                    atomIndex += 1;
                }

                if( onBond ){
                    // intra group bonds
                    var groupBondAtomList = groupData.bondAtomList;
                    for( k = 0, kl = groupData.bondOrderList.length; k < kl; ++k ){
                        onBond({
                            atomIndex1: atomIndex - groupAtomCount + groupBondAtomList[ k * 2 ],
                            atomIndex2: atomIndex - groupAtomCount + groupBondAtomList[ k * 2 + 1 ],
                            bondOrder: groupData.bondOrderList[ k ]
                        });
                    }
                }

                groupIndex += 1;
            }

            chainIndex += 1;
        }

        modelFirstAtomIndex = modelLastAtomIndex + 1;
        modelLastAtomIndex = atomIndex - 1;  // subtract one as it already has been incremented

        if( onBond ){
            // inter group bonds
            if( bondAtomList ){
                for( k = 0, kl = bondAtomList.length; k < kl; k += 2 ){
                    var atomIndex1 = bondAtomList[ k ];
                    var atomIndex2 = bondAtomList[ k + 1 ];
                    if( ( atomIndex1 >= modelFirstAtomIndex && atomIndex1 <= modelLastAtomIndex ) ||
                        ( atomIndex2 >= modelFirstAtomIndex && atomIndex2 <= modelLastAtomIndex )
                    ){
                        onBond({
                            atomIndex1: atomIndex1,
                            atomIndex2: atomIndex2,
                            bondOrder: bondOrderList ? bondOrderList[ k / 2 ] : null
                        });
                    }
                }
            }
        }

        modelIndex += 1;
    }

}

export default traverseMmtf;
