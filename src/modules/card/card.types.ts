export interface Card {
	id: string;
	accountId: string;
	type: "debit" | "credit";
	pinHash: string;
	creditLimit?: number;
	activated: boolean;
}
