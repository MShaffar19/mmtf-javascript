
//////////////////
// mmtf decoding
//
QUnit.module( "mmtf decoding" );

QUnit.test( "empty full", function( assert ) {
    var dict = getEmptyFullMmtfDict();
    assert.equal( Object.keys( dict ).length, 39, "Wrong number of fields in msgpack" );
    checkMsgpack( dict, assert );
    var decodedMmtf = decodeMmtf( dict );
    checkMmtf( decodedMmtf, assert );
    var expectedMmtf = getEmptyFullDecodedMmtfDict();
    equalDict( decodedMmtf, expectedMmtf, assert );
    // assert.deepEqual( decodedMmtf, expectedMmtf, "Passed!" );
});

QUnit.test( "empty required", function( assert ) {
    var dict = getEmptyRequiredMmtfDict();
    checkMsgpack( dict, assert );
    var decodedMmtf = decodeMmtf( dict );
    checkMmtf( decodedMmtf, assert );
    var expectedMmtf = getEmptyRequiredDecodedMmtfDict();
    equalDict( decodedMmtf, expectedMmtf, assert );
    // assert.deepEqual( decodedMmtf, expectedMmtf, "Passed!" );
});

QUnit.test( "filled full", function( assert ) {
    var dict = getFilledFullMmtfDict();
    assert.equal( Object.keys( dict ).length, 39, "Wrong number of fields in msgpack" );
    checkMsgpack( dict, assert );
    var decodedMmtf = decodeMmtf( dict );
    checkMmtf( decodedMmtf, assert );
    var expectedMmtf = getFilledFullDecodedMmtfDict();
    equalDict( decodedMmtf, expectedMmtf, assert );
    // assert.deepEqual( decodedMmtf, expectedMmtf, "Passed!" );
});

QUnit.test( "filled required", function( assert ) {
    var dict = getFilledRequiredMmtfDict();
    checkMsgpack( dict, assert );
    var decodedMmtf = decodeMmtf( dict );
    checkMmtf( decodedMmtf, assert );
    var expectedMmtf = getFilledRequiredDecodedMmtfDict();
    equalDict( decodedMmtf, expectedMmtf, assert );
    // assert.deepEqual( decodedMmtf, expectedMmtf, "Passed!" );
});
