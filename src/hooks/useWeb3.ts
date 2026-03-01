import utils from "@/lib/utils";
import { EventParser, Idl, MethodsNamespace, Program } from "@coral-xyz/anchor";
import { useAnchorProvider } from "./useAnchorProvider";
import {
  getAnchorErrorMessage,
  logAnchorError,
  parseAnchorError,
} from "@/lib/programErrorParser";
import { Status } from "@/core/Status";
import { SimulateResponse } from "@coral-xyz/anchor/dist/cjs/program/namespace/simulate";
import {
  AccountInfo,
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  AccountLayout,
  getAssociatedTokenAddress,
  MintLayout,
} from "@solana/spl-token";
import type { AnchorProvider, MethodsBuilderFactory } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";

type ProgramMethod = ReturnType<Program<Idl>["methods"][string]>;

export interface SendTxResult {
  tx: ParsedTransactionWithMeta;
  txSig: string;
  events: Record<string, any>;
  getEvent: (evtName: string) => any;
}

export interface ProgramTxProps {
  programId?: string | undefined | null;
  network: string;
  method: string;
  args: any[];
  accounts: Record<string, any>;
  idl: string | object;
  onTxSubmitted?: any | null;
}

export interface SendBatchTxProps {
  network: string;
  onTxSubmitted?: any | null;
  instructions: {
    programId?: string | undefined | null;
    method: string;
    args: any[];
    accounts: Record<string, any>;
    idl: string | object;
  }[];
}

export interface ProgramPdas {
  mainConfigPda: PublicKey;
  protocolStatePda: PublicKey;
  mintPda: PublicKey;
  mintAuthorityPda: PublicKey;
}

export interface FetchAccountsProps {
  network: string;
  accounts: Record<
    string,
    {
      idl: object | string;
      programId: PublicKey | string;
      pubkey: PublicKey;
      accountName: string;
    }
  >;
}

export interface DecodedAccountInfo extends AccountInfo<any> {
  decodedData: any;
}

const loadedIdls: Record<string, any> = {};
const loadedNetworks: Record<string, any> = {};

export const useWeb3 = () => {
  const anchorProvider = useAnchorProvider();
  const { connection } = useConnection();

  const getProgramId = async (network: string): Promise<PublicKey> => {
    let config;

    if (network in loadedNetworks) {
      config = loadedNetworks[network];
    } else {
      config = await import(`@/config/programs/${network}.json`);
      loadedNetworks[network] = config;
    }

    return new PublicKey(config.programId);
  };

  const findProgramAddress = (
    seeds: Array<Buffer | Uint8Array>,
    programId: PublicKey,
  ): Promise<[PublicKey, number]> => {
    return Promise.resolve(PublicKey.findProgramAddressSync(seeds, programId));
  };

  const getProgramPdas = async (networkId: string): Promise<ProgramPdas> => {
    
    let programId = await getProgramId(networkId);

    const [mainConfigPda] = await findProgramAddress(
      [Buffer.from("main_config")],
      programId,
    );

    const [protocolStatePda] = await findProgramAddress(
      [Buffer.from("protocol_state")],
      programId,
    );

    const [mintPda] = await findProgramAddress(
      [Buffer.from("mint")],
      programId,
    );

    const [mintAuthorityPda] = await findProgramAddress(
      [Buffer.from("mint_authority")],
      programId,
    );

    return {
      mainConfigPda,
      protocolStatePda,
      mintPda,
      mintAuthorityPda,
    };
  };

  const getStakingPdas = async (
    networkId: string,
  ): Promise<{
    stakingVaultPda: PublicKey;
    stakingStatsPda: PublicKey;
    mintPda: PublicKey;
  }> => {
    let programId = await getProgramId(networkId);

    const [mintPda] = await findProgramAddress(
      [Buffer.from("mint")],
      programId,
    );

    const [stakingVaultPda] = await findProgramAddress(
      [Buffer.from("staking_vault"), mintPda.toBuffer()],
      programId,
    );

    const [stakingStatsPda] = await findProgramAddress(
      [Buffer.from("staking_stats")],
      programId,
    );

    return { stakingVaultPda, stakingStatsPda, mintPda };
  };

  const getAccountTokenAddress = async (
    ownerAddr: PublicKey,
    networkId: string,
    allowOwnerOffCurve: boolean | undefined = false,
  ): Promise<PublicKey> => {
    
    let programId = await getProgramId(networkId);

    const [mintPda] = await findProgramAddress(
      [Buffer.from("mint")],
      programId,
    );

    return getAssociatedTokenAddress(
      mintPda,
      ownerAddr,
      allowOwnerOffCurve, // allowOwnerOffCurve (false for normal wallets)
    );
  };

  const fetchIDL = async (name: string) => {
    if (name in loadedIdls) {
      return loadedIdls[name];
    } else {
      let idl = (await import(`@/data/idl/${name}.json`)).default;
      loadedIdls[name] = idl;
      return idl;
    }
  };

  const prepareTx = async (
    params: ProgramTxProps,
  ): Promise<{
    provider: AnchorProvider;
    programMethod: ProgramMethod;
    idl: Idl;
    programId: string | PublicKey;
    program: Program<Idl>;
  }> => {
    const {
      programId: _programId,
      network,
      method,
      args,
      accounts,
      idl: idlNameOrData,
    } = params;

    // lets load the program
    let programId = _programId ? _programId : await getProgramId(network);

    // lets replace the address in the idl
    let _idl =
      typeof idlNameOrData == "object"
        ? idlNameOrData
        : await fetchIDL(idlNameOrData);

    const idl = { address: programId, ..._idl };

    // lets replace the program id into the idl
    idl.address = programId;

    const provider = anchorProvider.getProvider(network);

    //lets now query
    const program = new Program(idl, provider);

    // lets now stimulate the call
    let programMethod = program.methods[method](...args);

    if (Object.keys(accounts).length > 0) {
      programMethod = programMethod.accounts(accounts);
    }

    return { provider, program, programMethod, programId, idl };
  };

  const simulateTx = async (
    params: ProgramTxProps,
  ): Promise<Status<SimulateResponse | undefined>> => {
    let program: Program<Idl>;

    try {
      const txInfo = await prepareTx(params);

      program = txInfo.program;
      const programMethod = txInfo.programMethod;

      let result = await programMethod.simulate();

      return Status.successData(result);
    } catch (e) {
      // Now 'program' is accessible here
      //const parsedError = parseAnchorError(e, program);
      const userMessage = getAnchorErrorMessage(e, program);

      // Optionally log full details
      logAnchorError(e, program);

      return Status.error(userMessage);
    }
  };

  const sendTx = async (
    params: ProgramTxProps,
  ): Promise<Status<SendTxResult | null>> => {
    let program: Program<Idl>;

    try {
      const { programMethod, provider, program } = await prepareTx(params);

      //program = txInfo.program;
      const txSig = await programMethod.rpc();

      const onTxSubmitted = params.onTxSubmitted;

      if (onTxSubmitted) {
        onTxSubmitted(txSig);
      }

      const tx = await provider.connection.getParsedTransaction(txSig, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      let rawLogs = tx?.meta?.logMessages || [];

      const eventParser = new EventParser(program.programId, program.coder);

      const events = {};

      for (const event of eventParser.parseLogs(rawLogs)) {
        events[event.name] = event.data;
      }

      const getEvent = (evtName: string): any => events[evtName];

      return Status.successData({ tx, txSig, events, getEvent });
    } catch (e) {
      // Now 'program' is accessible here
      //const parsedError = parseAnchorError(e, program);
      const userMessage = getAnchorErrorMessage(e, program);

      // Optionally log full details
      logAnchorError(e, program);

      console.log(e, e.stack);

      return Status.error(userMessage);
    }
  };

  const sendBatchTx = async (
    params: SendBatchTxProps,
  ): Promise<Status<SendTxResult | null>> => {
    try {
      
      const { network } = params;
      const tx = new Transaction();
      const provider = anchorProvider.getProvider(network);

      tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 800000 }));

      const programs = [];

      for (let programParam of params.instructions) {
        //console.log("programParam===>", programParam)
        const { programMethod, program } = await prepareTx({
          network,
          ...programParam,
        });

        let ix = await programMethod.instruction();
        tx.add(ix);

        //save program
        programs.push(program);
      }

      let txSig = await provider.sendAndConfirm(tx);

      const onTxSubmitted = params.onTxSubmitted;

      if (onTxSubmitted) {
        onTxSubmitted(txSig);
      }

      const parsedTx = await provider.connection.getParsedTransaction(txSig, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      const rawLogs = parsedTx?.meta?.logMessages || [];
      const events: Record<string, any> = {};

      for (const program of programs) {
        const eventParser = new EventParser(program.programId, program.coder);
        for (const evt of eventParser.parseLogs(rawLogs)) {
          events[evt.name] = evt.data;
        }
      }

      const getEvent = (evtName: string) => events[evtName];

      return Status.successData({ tx: parsedTx, txSig, events, getEvent });
    } catch (e) {
      console.log(e, e.stack);
      return Status.error(e.message || "Transaction failed");
    }
  };

  const fetchAccountsInfo = async (
    params: FetchAccountsProps,
  ): Promise<Status<Record<string, DecodedAccountInfo> | null>> => {
    try {
      const { network, accounts: acctsParams } = params;

       //console.log("acctsParams===>", acctsParams)

      const pubkeys = Object.values(acctsParams).map((item) => item.pubkey);

      //console.log("pubkeys==>", pubkeys);

      const provider = anchorProvider.getProvider(network);

      ///console.log("provider===>", provider)

      const accountsInfoArr = await provider.connection.getMultipleAccountsInfo(pubkeys);
      
      //console.log("accountsInfoArr===>", accountsInfoArr)

      let acctsKeys = Object.keys(acctsParams);

      let finalResults = {};

      for (let idx in accountsInfoArr) {
        const onChainAcctInfo: DecodedAccountInfo = accountsInfoArr[
          idx
        ] as DecodedAccountInfo;

        let acctParamKey = acctsKeys[idx];

        // console.log("acctKey===>", acctKey)

        if (onChainAcctInfo == null) {
          finalResults[acctParamKey] = null;
          continue;
        }

        let acctParam = acctsParams[acctParamKey];
        
        //console.log("acctParam===>", acctParam)

        //lets decode the returned data
        let idl = typeof acctParam.idl === "string"
            ? await fetchIDL(acctParam.idl)
            : acctParam.idl;

        //console.log(idl)

        idl.address = acctParam.programId;

        //console.log(idl)

        let prog = new Program(idl, provider);

        if (acctParam.accountName == "splTokenInfo") {
          let decodedData = { ...MintLayout.decode(onChainAcctInfo.data) };

          if (decodedData != null && "supply" in decodedData) {
            // @ts-ignore
            decodedData.supplyFormatted = utils.formatUnit(
              decodedData.supply,
              decodedData.decimals,
            );
          }

          onChainAcctInfo.decodedData = decodedData;
          
        } else if (acctParam.accountName == "splTokenAccountInfo") {
          // decode token

          onChainAcctInfo.decodedData = AccountLayout.decode(
            onChainAcctInfo.data,
          );
        } else if (acctParam.accountName === "rankDifficulty") {
          // ✅ RAW account — do NOT use Anchor decoder

          onChainAcctInfo.decodedData = {
            raw: onChainAcctInfo.data,
            length: onChainAcctInfo.data.length,
          };
        } else {
          onChainAcctInfo.decodedData = await prog.coder.accounts.decode(
            acctParam.accountName,
            onChainAcctInfo.data,
          );
        }

        //console.log("onChainAcctInfo==>", onChainAcctInfo)

        finalResults[acctParamKey] = onChainAcctInfo;
      }

      return Status.successData(finalResults);
    } catch (e) {
      console.log(e, e.stack);
      return Status.error(e.message);
    }
  };

  const getNativeBalance = async (
    address: PublicKey,
  ): Promise<Status<{ balance: number; balanceLamport: number }>> => {
    try {
      const provider = anchorProvider.getProvider();

      if (!provider) return Status.error("Connect Wallet");

      const balanceLamport = await provider.connection.getBalance(address);

      const balance = balanceLamport / LAMPORTS_PER_SOL;

      return Status.successData({ balanceLamport, balance });
    } catch (e: any) {
      utils.logError("Failed to fetch native balance", e);
      return Status.error("Failed to fetch native balance");
    }
  };

  const getConnectionHash = async () => {
    try {
      const hash = await connection.getGenesisHash();

      return Status.successData(hash);
    } catch (e) {
      utils.logError("Failed to fetch native balance", e);
      return Status.error("Failed to fetch hash", null);
    }
  };

  return {
    simulateTx,
    sendTx,
    sendBatchTx,
    fetchIDL,
    getProgramId,
    fetchAccountsInfo,
    findProgramAddress,
    getProgramPdas,
    getNativeBalance,
    getConnectionHash,
    getStakingPdas,
    getAccountTokenAddress,
  };
};
