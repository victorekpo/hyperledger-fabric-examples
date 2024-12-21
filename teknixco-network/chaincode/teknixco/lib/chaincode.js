const { Contract } = require('fabric-contract-api');

class TeknixcoContract extends Contract {
    async initLedger(ctx) {
        console.log('Ledger initialized');
    }

    async createAsset(ctx, id, value) {
        const asset = { id, value };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return asset;
    }

    async readAsset(ctx, id) {
        const assetBytes = await ctx.stub.getState(id);
        if (!assetBytes || assetBytes.length === 0) {
            throw new Error(`Asset ${id} does not exist`);
        }
        return JSON.parse(assetBytes.toString());
    }
}

module.exports = TeknixcoContract;
