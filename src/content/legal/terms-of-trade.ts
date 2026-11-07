export type TermsBlock =
  | { kind: "clause"; marker: string; text: string; level: 0 | 1 | 2 }
  | { kind: "paragraph"; text: string; level: 0 | 1 | 2 }
  | { kind: "note"; text: string };

export type TermsSection = {
  heading: string;
  blocks: TermsBlock[];
};

export type TermsDocument = {
  title: string;
  sections: TermsSection[];
};

export const termsOfTrade: TermsDocument = {
  title: "HyDesign Aust Pty Ltd – Terms & Conditions of Trade",
  sections: [
    {
      heading: "1. Definitions",
      blocks: [
        {
          kind: "clause",
          marker: "1.1.",
          text: "“HyDesign” means HyDesign Aust Pty Ltd, its successors and assigns or any person acting on behalf of and with the authority of HyDesign Aust Pty Ltd.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "1.2.",
          text: "“Client” means the person/s or any person acting on behalf of and with the authority of the Client requesting HyDesign to provide the Services as specified in any proposal, quotation, order, invoice or other documentation, and:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "if there is more than one Client, is a reference to each Client jointly and severally; and",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "if the Client is a part of a Trust, shall be bound in their capacity as a trustee; and",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "includes the Client’s executors, administrators, successors and permitted assigns.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "1.3.",
          text: "“Goods” means all Goods or Services supplied by HyDesign to the Client at the Client’s request from time to time (where the context so permits the terms ‘Goods’ or ‘Services’ shall be interchangeable for the other).",
          level: 0,
        },
        {
          kind: "clause",
          marker: "1.4.",
          text: "“Price” means the Price payable (plus any GST where applicable) for the Goods as agreed between HyDesign and the Client in accordance with clause 6 below.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "1.5.",
          text: "“GST” means Goods and Services Tax (GST) as defined within the “A New Tax System (Goods and Services Tax) Act 1999” (Cth).",
          level: 0,
        },
      ],
    },
    {
      heading: "2. Acceptance",
      blocks: [
        {
          kind: "clause",
          marker: "2.1.",
          text: "The Client is taken to have exclusively accepted and is immediately bound, jointly and severally, by these terms and conditions if the Client places an order for or accepts delivery of the Goods.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "2.2.",
          text: "These terms and conditions may only be amended with the consent of both parties in writing, and shall prevail to the extent of any inconsistency with any other document or contract between the Client and HyDesign.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "2.3.",
          text: "Goods are supplied by HyDesign only on the terms and conditions of trade herein to the exclusion of anything to the contrary in the terms of the Client’s order notwithstanding that any such order is placed on terms that purport to override these terms and conditions of trade.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "2.4.",
          text: "Once accepted by the Client, HyDesign’s written quotation shall be deemed to interpret correctly the Client’s instructions, whether written or verbal.",
          level: 0,
        },
        {
          kind: "paragraph",
          text: "Where verbal instructions only are received from the Client, HyDesign shall not be responsible for errors or omissions due to oversight or misinterpretation of those instructions.",
          level: 0,
        },
      ],
    },
    {
      heading: "3. Electronic Transactions (Victoria) Act 2000",
      blocks: [
        {
          kind: "clause",
          marker: "3.1.",
          text: "Electronic signatures shall be deemed to be accepted by either party providing that the parties have complied with Section 9 of the Electronic Transactions (Victoria) Act 2000 or any other applicable provisions of that Act or any Regulations referred to in that Act.",
          level: 0,
        },
      ],
    },
    {
      heading: "4. Errors and Omissions",
      blocks: [
        {
          kind: "clause",
          marker: "4.1.",
          text: "The Client acknowledges and accepts that HyDesign shall, without prejudice, accept no liability in respect of any alleged or actual error(s) and/ or omission(s):",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "resulting from an inadvertent mistake made by HyDesign in the formation and/or administration of this contract; and/or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "contained in/omitted from any literature (hard copy and/or electronic) supplied by HyDesign in respect of the Services.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "4.2.",
          text: "In the event such an error and/or omission occurs in accordance with clause 4.1, and is not attributable to the negligence and/or wilful misconduct of HyDesign; the Client shall not be entitled to treat this contract as repudiated nor render it invalid.",
          level: 0,
        },
      ],
    },
    {
      heading: "5. Change in Control",
      blocks: [
        {
          kind: "clause",
          marker: "5.1.",
          text: "The Client shall give HyDesign not less than fourteen (14) days prior written notice of any proposed change of ownership of the Client and/or any other change in the Client’s details (including but not limited to, changes in the Client’s name, address, contact phone or fax number/s, or business practice). The Client shall be liable for any loss incurred by HyDesign as a result of the Client’s failure to comply with this clause.",
          level: 0,
        },
      ],
    },
    {
      heading: "6. Price and Payment",
      blocks: [
        {
          kind: "clause",
          marker: "6.1.",
          text: "At HyDesign’s sole discretion the Price shall be HyDesign’s quoted price (subject to clause 6.2) which will be valid for the period stated in the quotation or otherwise for a period of thirty (30) days.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "6.2.",
          text: "HyDesign reserves the right to change the Price if a variation to HyDesign’s quotation is requested. Any variation from the plan of scheduled Services or specifications (including, but not limited to, any variation as a result of additional services required due to unforeseen circumstances such as poor weather conditions, limitations to accessing the site, availability of machinery, change in scope of work required, delays or non-approval in obtaining council or local authority permits, or as a result of any increase to HyDesign’s in the cost of materials and labour) will be charged for on the basis of HyDesign’s quotation and will be shown as variations on the invoice. Payment for all variations must be made in full at their time of completion.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "6.3.",
          text: "Variations will be charged for on the basis of HyDesign’s quotation, and will be detailed in writing, and shown as variations on HyDesign’s invoice. The Client shall be required to respond to any variation submitted by HyDesign within ten (10) working days. Failure to do so will entitle HyDesign to add the cost of the variation to the Price. Payment for all variations must be made in full at the time of their completion.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "6.4.",
          text: "At HyDesign’s sole discretion a deposit of up to fifty percent (50%) of the Price may be required.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "6.5.",
          text: "No allowance has been made in the Price for the deduction of retentions. In the event that retentions are made, HyDesign reserves the right to treat all retentions as placing the Client’s account into default.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "6.6.",
          text: "Time for payment for the Goods being of the essence, the Price will be payable by the Client on the date/s determined by HyDesign, which may be:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "on delivery of the Goods;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "by way of progress payments in accordance with HyDesign’s payment schedule being;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(i)",
          text: "a deposit (if requested);",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(ii)",
          text: "payment on provision of the signage being completed (where installation is part of the Services or if not, then this shall be final payment); and",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(iii)",
          text: "the final payment on completion of the installation where applicable.",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "the date specified on any invoice or other form as being the date for payment; or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "failing any notice to the contrary, for previously approved Clients, the date which shall be either seven (7) or thirty (30) days following the date of any invoice given to the Client by HyDesign.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "6.7.",
          text: "Payment may be made by cash, cheque, electronic/on-line banking, credit card (a surcharge may apply per transaction), or by any other method as agreed to between the Client and HyDesign.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "6.8.",
          text: "The Client shall not be entitled to set off against, or deduct from the Price, any sums owed or claimed to be owed to the Client by HyDesign nor to withhold payment of any invoice because part of that invoice is in dispute.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "6.9.",
          text: "Unless otherwise stated the Price does not include GST. In addition to the Price the Client must pay to HyDesign an amount equal to any GST HyDesign must pay for any supply by HyDesign under this or any other agreement for the sale of the Goods. The Client must pay GST, without deduction or set off of any other amounts, at the same time and on the same basis as the Client pays the Price. In addition, the Client must pay any other taxes and duties that may be applicable in addition to the Price except where they are expressly included in the Price.",
          level: 0,
        },
      ],
    },
    {
      heading: "7. Delivery of Goods",
      blocks: [
        {
          kind: "clause",
          marker: "7.1.",
          text: "Delivery (“Delivery”) of the Goods is taken to occur at the time that:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "the Client or the Client’s nominated carrier takes possession of the Goods at HyDesign’s address; or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "HyDesign (or HyDesign’s nominated carrier) delivers the Goods to the Client’s nominated address even if the Client is not present at the address.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "7.2.",
          text: "At HyDesign’s sole discretion the cost of delivery is in addition to the Price.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "7.3.",
          text: "The Client must take delivery by receipt or collection of the Goods whenever they are tendered for delivery. In the event that the Client is unable to take delivery of the Goods as arranged then HyDesign shall be entitled to charge a reasonable fee for redelivery and/or storage.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "7.4.",
          text: "In conjunction with clause 7.5, where installation is part of the Services to be provided and such installation is delayed or fails to occur (due to factors including, but not limited to, failure on the Client’s behalf to secure appropriate permits or approvals), then the Client shall be responsible for payment of any Services and/or supply of Goods. Where HyDesign is required to store the Goods until such time that installation can be effected, a storage fee may be applicable as per clause 7.3.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "7.5.",
          text: "HyDesign may deliver the Goods in separate instalments. Each separate instalment shall be invoiced and paid in accordance with the provisions in these terms and conditions.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "7.6.",
          text: "Any time or date given by HyDesign to the Client is an estimate only. The Client must still accept delivery of the Goods even if late and HyDesign will not be liable for any loss or damage incurred by the Client as a result of the delivery being late.",
          level: 0,
        },
      ],
    },
    {
      heading: "8. Risk",
      blocks: [
        {
          kind: "clause",
          marker: "8.1.",
          text: "Risk of damage to or loss of the Goods passes to the Client on Delivery and the Client must insure the Goods on or before Delivery.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.2.",
          text: "If any of the Goods are damaged or destroyed following delivery but prior to ownership passing to the Client, HyDesign is entitled to receive all insurance proceeds payable for the Goods. The production of these terms and conditions by HyDesign is sufficient evidence of HyDesign’s rights to receive the insurance proceeds without the need for any person dealing with HyDesign to make further enquiries.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.3.",
          text: "If the Client requests HyDesign to leave Goods outside HyDesign’s premises for collection or to deliver the Goods to an unattended location then such Goods shall be left at the Client’s sole risk.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.4.",
          text: "All work carried out whether experimentally or otherwise at the Client’s request will be charged to the Client.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.5.",
          text: "Any tabulated work and/or foreign language included in the job but not contained in the manuscript originally submitted for the purpose of estimating may be charged to the Client and shown as extras on the invoice.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.6.",
          text: "Unless otherwise agreed, the Client shall bear the cost of fonts, or colour proofs, or artwork, specially bought at its request for the Services.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.7.",
          text: "HyDesign shall be under no liability whatever to the Client for any variation (beyond the reasonable control of HyDesign) in colours between the approved prototype and the finished Goods.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.8.",
          text: "Where the performance of any contract with the Client requires HyDesign to obtain Goods or Services from a third party, the contract between HyDesign and the Client shall incorporate and shall be subject to the conditions of supply of such Goods and Services to HyDesign, and the Client shall be liable for the cost in full including HyDesign’s margin of such Goods or Services.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.9.",
          text: "Whilst every care is taken by HyDesign to carry out the instructions of the Client, it is the Client’s responsibility to undertake a final proof reading of the Goods. HyDesign shall be under no liability whatever for any errors not corrected by the Client in the final proof reading. Should the Client’s alterations require additional proofs this shall be invoiced as an extra.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.10.",
          text: "HyDesign is under no obligation to provide samples of Goods ordered other than by virtual (computerised) sample. Whilst every effort will be taken by HyDesign to match virtual colours with physical colours, HyDesign will take no responsibility for any variation between virtual sale samples and either the virtual sale sample displayed on the Client’s computer and/or the final product. Should a physical sample be required this will be provided on request by the Client and will be charged for as an extra including return freight, the charge will be contra against the final invoice.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.11.",
          text: "While every effort will be taken by HyDesign to match PMS colours, HyDesign will take no responsibility for any variation due to substrates, half tones and/or detailed graphics between sale samples (including but not limited to virtual or physical samples) and the final product.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.12.",
          text: "HyDesign shall not be held liable for inks wearing off through general wear and tear.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.13.",
          text: "Where the Client supplies materials, adequate quantities shall be supplied to cover spoilage. Sheets and other materials shall not be counted or checked when received unless requested by the Client in writing. An additional charge may be made by HyDesign in respect of any such counting or checking requested by the Client.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.14.",
          text: "In the case of property and materials left with HyDesign without specific instructions, HyDesign shall be free to dispose of them at the end of twelve (12) months after his receiving them and to accept and retain any proceeds gained from such disposal to cover HyDesign’s costs in holding and handling such items.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.15.",
          text: "Where materials or equipment are supplied by the Client for the provision of Services HyDesign shall accept no liability for imperfect work caused by defects in, or the unsuitability of, such materials or equipment for the Services.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.16.",
          text: "Any change or correction to any film, bromides, artwork and/or any printing surface supplied by the Client which is deemed necessary by HyDesign to ensure correctly finished work shall be invoiced as an extra.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.17.",
          text: "In the event that the Client believes that HyDesign has scratched the vehicle during the installation/application process of the Goods, the Client shall within twenty-four (24) hours of delivery (time being of the essence) notify HyDesign of any alleged defect or damage. The Client shall afford HyDesign an opportunity to inspect the vehicle within a reasonable time following delivery. If the Client fails to comply with clause 8.17, the vehicle shall be presumed to be free from any defect or damage.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.18.",
          text: "The Client acknowledges that it is the Client’s responsibility to remove all personal/valuable items from the vehicle prior to HyDesign carrying out their Services. HyDesign shall not liable in the event of any apparent loss or damage to personal/valuable items left in the vehicle.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.19.",
          text: "The Client acknowledges and accepts that the Goods supplied by HyDesign may experience shrinkage or may move after installation/ application, which is considered normal practice for these types of Goods and thereby not covered by HyDesign’s as a defect or under warranty.",
          level: 0,
        },
        {
          kind: "paragraph",
          text: "HyDesign shall not be liable for any loss or damage in this event, where circumstances are beyond the control of HyDesign.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.20.",
          text: "The Client accepts that the in the event that the vehicle is stored for any period on HyDesign’s premises that it is done so at the Client’s own risk and it shall be the client’s responsibility to ensure their vehicle and its contents are insured adequately or at all.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "8.21.",
          text: "The Client acknowledges that HyDesign can only provide its Services on a vehicle in its current state as supplied to HyDesign therefore HyDesign shall not accept any responsibility for the workmanship of any third party that has worked on a Client’s vehicle prior to Services being undertaken by HyDesign (including, but not limited to, poor paintwork or repairs).",
          level: 0,
        },
      ],
    },
    {
      heading: "9. Artwork and Proof Reading",
      blocks: [
        {
          kind: "clause",
          marker: "9.1.",
          text: "Whilst every care is taken by HyDesign to carry out the instructions of the Client, it is the Client’s responsibility to undertake a final proof reading of the Goods. HyDesign shall accept no liability whatsoever for any errors not picked up and/or corrected by the Client in the final proof reading.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "9.2.",
          text: "The Client shall be entitled to three (3) reviews of the artwork without charge and if further reviews are requested, then HyDesign shall reserve the right to charge for additional time and costs associated with such additional reviews.",
          level: 0,
        },
      ],
    },
    {
      heading: "10. Access",
      blocks: [
        {
          kind: "clause",
          marker: "10.1.",
          text: "The Client shall ensure that HyDesign has clear and free access to the installation site at all times to enable them to undertake the Services.",
          level: 0,
        },
        {
          kind: "paragraph",
          text: "HyDesign shall not be liable for any loss or damage to the site (including, without limitation, damage to pathways, driveways and concreted or paved or grassed areas) unless due to the negligence of HyDesign.",
          level: 0,
        },
      ],
    },
    {
      heading: "11. Compliance with Laws",
      blocks: [
        {
          kind: "clause",
          marker: "11.1.",
          text: "The Client and HyDesign shall comply with the provisions of all statutes, regulations and bylaws of government, local and other public authorities that may be applicable to the Services.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "11.2.",
          text: "The Client shall obtain (at the expense of the Client) all licenses and approvals that may be required for the Services.",
          level: 0,
        },
      ],
    },
    {
      heading: "12. Title",
      blocks: [
        {
          kind: "clause",
          marker: "12.1.",
          text: "HyDesign and the Client agree that ownership of the Goods shall not pass until:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "the Client has paid HyDesign all amounts owing to HyDesign; and",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "the Client has met all of its other obligations to HyDesign.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "12.2.",
          text: "Receipt by HyDesign of any form of payment other than cash shall not be deemed to be payment until that form of payment has been honoured, cleared or recognised.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "12.3.",
          text: "It is further agreed that:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "until ownership of the Goods passes to the Client in accordance with clause 12.1 that the Client is only a bailee of the Goods and must return the Goods to HyDesign on request.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "the Client holds the benefit of the Client’s insurance of the Goods on trust for HyDesign and must pay to HyDesign the proceeds of any insurance in the event of the Goods being lost, damaged or destroyed.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "the Client must not sell, dispose, or otherwise part with possession of the Goods other than in the ordinary course of business and for market value. If the Client sells, disposes or parts with possession of the Goods then the Client must hold the proceeds of any such act on trust for HyDesign and must pay or deliver the proceeds to HyDesign on demand.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "the Client should not convert or process the Goods or intermix them with other goods but if the Client does so then the Client holds the resulting product on trust for the benefit of HyDesign and must sell, dispose of or return the resulting product to HyDesign as it so directs.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(e)",
          text: "the Client irrevocably authorises HyDesign to enter any premises where HyDesign believes the Goods are kept and recover possession of the Goods.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(f)",
          text: "HyDesign may recover possession of any Goods in transit whether or not delivery has occurred.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(g)",
          text: "the Client shall not charge or grant an encumbrance over the Goods nor grant nor otherwise give away any interest in the Goods while they remain the property of HyDesign.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(h)",
          text: "HyDesign may commence proceedings to recover the Price of the Goods sold notwithstanding that ownership of the Goods has not passed to the Client.",
          level: 1,
        },
      ],
    },
    {
      heading: "13. Personal Property Securities Act 2009 (“PPSA”)",
      blocks: [
        {
          kind: "clause",
          marker: "13.1.",
          text: "In this clause financing statement, financing change statement, security agreement, and security interest has the meaning given to it by the PPSA.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "13.2.",
          text: "Upon assenting to these terms and conditions in writing the Client acknowledges and agrees that these terms and conditions constitute a security agreement for the purposes of the PPSA and creates a security interest in all Goods and/or collateral (account) – being a monetary obligation of the Client to HyDesign for Services – that have previously been supplied and that will be supplied in the future by HyDesign to the Client.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "13.3.",
          text: "The Client undertakes to:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "promptly sign any further documents and/or provide any further information (such information to be complete, accurate and up-to-date in all respects) which HyDesign may reasonably require to;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(i)",
          text: "register a financing statement or financing change statement in relation to a security interest on the Personal Property Securities Register;",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(ii)",
          text: "register any other document required to be registered by the PPSA; or",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(iii)",
          text: "correct a defect in a statement referred to in clause 13.3(a)(i) or 13.3(a)(ii);",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "indemnify, and upon demand reimburse, HyDesign for all expenses incurred in registering a financing statement or financing change statement on the Personal Property Securities Register established by the PPSA or releasing any Goods charged thereby;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "not register a financing change statement in respect of a security interest without the prior written consent of HyDesign; (d) not register, or permit to be registered, a financing statement or a financing change statement in relation to the Goods and/or collateral (account) in favour of a third party without the prior written consent of HyDesign;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(e)",
          text: "immediately advise HyDesign of any material change in its business practices of selling the Goods which would result in a change in the nature of proceeds derived from such sales.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "13.4.",
          text: "HyDesign and the Client agree that sections 96, 115 and 125 of the PPSA do not apply to the security agreement created by these terms and conditions.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "13.5.",
          text: "The Client waives their rights to receive notices under sections 95, 118, 121(4), 130, 132(3)(d) and 132(4) of the PPSA.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "13.6.",
          text: "The Client waives their rights as a grantor and/or a debtor under sections 142 and 143 of the PPSA.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "13.7.",
          text: "Unless otherwise agreed to in writing by HyDesign, the Client waives their right to receive a verification statement in accordance with section 157 of the PPSA.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "13.8.",
          text: "The Client must unconditionally ratify any actions taken by HyDesign under clauses 13.3 to 13.5.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "13.9.",
          text: "Subject to any express provisions to the contrary (including those contained in this clause 13) nothing in these terms and conditions is intended to have the effect of contracting out of any of the provisions of the PPSA.",
          level: 0,
        },
      ],
    },
    {
      heading: "14. Security and Charge",
      blocks: [
        {
          kind: "clause",
          marker: "14.1.",
          text: "In consideration of HyDesign agreeing to supply the Goods, the Client charges all of its rights, title and interest (whether joint or several) in any land, realty or other assets capable of being charged, owned by the Client either now or in the future, to secure the performance by the Client of its obligations under these terms and conditions (including, but not limited to, the payment of any money).",
          level: 0,
        },
        {
          kind: "clause",
          marker: "14.2.",
          text: "The Client indemnifies HyDesign from and against all HyDesign’s costs and disbursements including legal costs on a solicitor and own client basis incurred in exercising HyDesign’s rights under this clause.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "14.3.",
          text: "The Client irrevocably appoints HyDesign and each director of HyDesign as the Client’s true and lawful attorney/s to perform all necessary acts to give effect to the provisions of this clause 14 including, but not limited to, signing any document on the Client’s behalf.",
          level: 0,
        },
      ],
    },
    {
      heading: "15. Defects, Warranties and Returns, Competition and Consumer Act 2010 (CCA)",
      blocks: [
        {
          kind: "clause",
          marker: "15.1.",
          text: "The Client must inspect the Goods on delivery and must within seven (7) days of delivery notify HyDesign in writing of any evident defect/damage, shortage in quantity, or failure to comply with the description or quote. The Client must notify any other alleged defect in the Goods as soon as reasonably possible after any such defect becomes evident. Upon such notification, the Client must allow HyDesign to inspect the Goods.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "15.2.",
          text: "Under applicable State, Territory and Commonwealth Law (including, without limitation the CCA), certain statutory implied guarantees and warranties (including, without limitation the statutory guarantees under the CCA) may be implied into these terms and conditions (Non-Excluded Guarantees).",
          level: 0,
        },
        {
          kind: "clause",
          marker: "15.3.",
          text: "HyDesign acknowledges that nothing in these terms and conditions purports to modify or exclude the Non-Excluded Guarantees.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "15.4.",
          text: "Except as expressly set out in these terms and conditions or in respect of the Non-Excluded Guarantees, HyDesign makes no warranties or other representations under these terms and conditions including but not limited to the quality or suitability of the Goods. HyDesign’s liability in respect of these warranties is limited to the fullest extent permitted by law.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "15.5.",
          text: "If the Client is a consumer within the meaning of the CCA, HyDesign’s liability is limited to the extent permitted by section 64A of Schedule 2.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "15.6.",
          text: "If HyDesign is required to replace the Goods under this clause or the CCA, but is unable to do so, HyDesign may refund any money the Client has paid for the Goods.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "15.7.",
          text: "If the Client is not a consumer within the meaning of the CCA, HyDesign’s liability for any defect or damage in the Goods is:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "limited to the value of any express warranty or warranty card provided to the Client by HyDesign at HyDesign’s sole discretion;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "limited to any warranty to which HyDesign is entitled, if HyDesign did not manufacture the Goods;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "otherwise negated absolutely.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "15.8.",
          text: "Subject to this clause 15, returns will only be accepted provided that:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "the Client has complied with the provisions of clause 15.1; and",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "HyDesign has agreed that the Goods are defective; and",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "the Goods are returned within a reasonable time at the Client’s cost (if that cost is not significant); and",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "the Goods are returned in as close a condition to that in which they were delivered as is possible.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "15.9.",
          text: "Notwithstanding clauses 15.1 to 15.8 but subject to the CCA, HyDesign shall not be liable for any defect or damage which may be caused or partly caused by or arise as a result of:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "the Client failing to properly maintain or store any Goods; (b) the Client using the Goods for any purpose other than that for which they were designed;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "the Client continuing the use of any Goods after any defect became apparent or should have become apparent to a reasonably prudent operator or user;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "the Client failing to follow any instructions or guidelines provided by HyDesign;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(e)",
          text: "fair wear and tear, any accident, or act of God.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "15.10.",
          text: "Notwithstanding anything contained in this clause if HyDesign is required by a law to accept a return then HyDesign will only accept a return on the conditions imposed by that law.",
          level: 0,
        },
      ],
    },
    {
      heading: "16. Intellectual Property",
      blocks: [
        {
          kind: "clause",
          marker: "16.1.",
          text: "Where HyDesign has designed, drawn or developed Goods for the Client, then the copyright in any designs and drawings and documents shall remain the property of HyDesign. Under no circumstances may such designs, drawings and documents be used without the express written approval of HyDesign.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "16.2.",
          text: "The Client warrants that all designs, specifications or instructions given to HyDesign will not cause HyDesign to infringe any patent, registered design or trademark in the execution of the Client’s order and the Client agrees to indemnify HyDesign against any action taken by a third party against HyDesign in respect of any such infringement.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "16.3.",
          text: "The Client agrees that HyDesign may (at no cost) use for the purposes of marketing or entry into any competition, any documents, designs, drawings or Goods which HyDesign has created for the Client.",
          level: 0,
        },
      ],
    },
    {
      heading: "17. Default and Consequences of Default",
      blocks: [
        {
          kind: "clause",
          marker: "17.1.",
          text: "Interest on overdue invoices shall accrue daily from the date when payment becomes due, until the date of payment, at a rate of two and a half percent (2.5%) per calendar month (and at HyDesign’s sole discretion such interest shall compound monthly at such a rate) after as well as before any judgment.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "17.2.",
          text: "If the Client owes HyDesign any money the Client shall indemnify HyDesign from and against all costs and disbursements incurred by HyDesign in recovering the debt (including but not limited to internal administration fees, legal costs on a solicitor and own client basis, HyDesign’s contract default fee, and bank dishonour fees).",
          level: 0,
        },
        {
          kind: "clause",
          marker: "17.3.",
          text: "Further to any other rights or remedies HyDesign may have under this contract, if a Client has made payment to HyDesign, and the transaction is subsequently reversed, the Client shall be liable for the amount of the reversed transaction, in addition to any further costs incurred by HyDesign under this clause 17 where it can be proven that such reversal is found to be illegal, fraudulent or in contravention to the Client’s obligations under this contract.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "17.4.",
          text: "Without prejudice to HyDesign’s other remedies at law HyDesign shall be entitled to cancel all or any part of any order of the Client which remains unfulfilled and all amounts owing to HyDesign shall, whether or not due for payment, become immediately payable if:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "any money payable to HyDesign becomes overdue, or in HyDesign’s opinion the Client will be unable to make a payment when it falls due;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "the Client has exceeded any applicable credit limit provided by HyDesign;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "the Client becomes insolvent, convenes a meeting with its creditors or proposes or enters into an arrangement with creditors, or makes an assignment for the benefit of its creditors; or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "a receiver, manager, liquidator (provisional or otherwise) or similar person is appointed in respect of the Client or any asset of the Client.",
          level: 1,
        },
      ],
    },
    {
      heading: "18. Cancellation",
      blocks: [
        {
          kind: "clause",
          marker: "18.1.",
          text: "Without prejudice to any other remedies HyDesign may have, if at any time the Client is in breach of any obligation (including those relating to payment) under these terms and conditions HyDesign may suspend or terminate the supply of Goods to the Client. HyDesign will not be liable to the Client for any loss or damage the Client suffers because HyDesign has exercised its rights under this clause.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "18.2.",
          text: "HyDesign may cancel any contract to which these terms and conditions apply or cancel delivery of Goods at any time before the Goods are delivered by giving written notice to the Client. On giving such notice HyDesign shall repay to the Client any money paid by the Client for the Goods. HyDesign shall not be liable for any loss or damage whatsoever arising from such cancellation.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "18.3.",
          text: "In the event that the Client cancels delivery of Goods the Client shall be liable for any and all loss incurred (whether direct or indirect) by HyDesign as a direct result of the cancellation (including, but not limited to, any loss of profits).",
          level: 0,
        },
        {
          kind: "clause",
          marker: "18.4.",
          text: "Cancellation of orders for Goods made to the Client’s specifications, or for non-stocklist items, will definitely not be accepted once production has commenced, or an order has been placed.",
          level: 0,
        },
      ],
    },
    {
      heading: "19. Privacy Act 1988",
      blocks: [
        {
          kind: "clause",
          marker: "19.1.",
          text: "The Client agrees for HyDesign to obtain from a credit reporting body (CRB) a credit report containing personal credit information (e.g. name, address, D.O.B, occupation, previous credit applications, credit history) about the Client in relation to credit provided by HyDesign.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "19.2.",
          text: "The Client agrees that HyDesign may exchange information about the Client with those credit providers and with related body corporates for the following purposes:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "to assess an application by the Client; and/or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "to notify other credit providers of a default by the Client; and/or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "to exchange information with other credit providers as to the status of this credit account, where the Client is in default with other credit providers; and/or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "to assess the creditworthiness of the Client including the Client’s repayment history in the preceding two years.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "19.3.",
          text: "The Client consents to HyDesign being given a consumer credit report to collect overdue payment on commercial credit.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "19.4.",
          text: "The Client agrees that personal credit information provided may be used and retained by HyDesign for the following purposes (and for other agreed purposes or required by):",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "the provision of Goods; and/or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "analysing, verifying and/or checking the Client’s credit, payment and/or status in relation to the provision of Goods; and/or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "processing of any payment instructions, direct debit facilities and/or credit facilities requested by the Client; and/or",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "enabling the collection of amounts outstanding in relation to the Goods.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "19.5.",
          text: "HyDesign may give information about the Client to a CRB for the following purposes:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "to obtain a consumer credit report;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "allow the CRB to create or maintain a credit information file about the Client including credit history.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "19.6.",
          text: "The information given to the CRB may include:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "personal information as outlined in 19.1 above;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "name of the credit provider and that HyDesign is a current credit provider to the Client;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "whether the credit provider is a licensee;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "type of consumer credit;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(e)",
          text: "details concerning the Client’s application for credit or commercial credit (e.g. date of commencement/termination of the credit account and the amount requested);",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(f)",
          text: "advice of consumer credit defaults, overdue accounts, loan repayments or outstanding monies which are overdue by more than sixty (60) days and for which written notice for request of payment has been made and debt recovery action commenced or alternatively that the Client no longer has any overdue accounts and HyDesign has been paid or otherwise discharged and all details surrounding that discharge (e.g. dates of payments);",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(g)",
          text: "information that, in the opinion of HyDesign, the Client has committed a serious credit infringement;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(h)",
          text: "advice that the amount of the Client’s overdue payment is equal to or more than one hundred and fifty dollars ($150).",
          level: 1,
        },
        {
          kind: "clause",
          marker: "19.7.",
          text: "The Client shall have the right to request (by e-mail) from HyDesign: (a) a copy of the information about the Client retained by HyDesign and the right to request that HyDesign correct any incorrect information; and (b) that HyDesign does not disclose any personal information about the Client for the purpose of direct marketing.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "19.8.",
          text: "HyDesign will destroy personal information upon the Client’s request (by email) or if it is no longer required unless it is required in order to fulfil the obligations of this agreement or is required to be maintained and/or stored in accordance with the law.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "19.9.",
          text: "The Client can make a privacy complaint by contacting HyDesign via email.",
          level: 0,
        },
        {
          kind: "paragraph",
          text: "HyDesign will respond to that complaint within seven (7) days of receipt and will take all reasonable steps to make a decision as to the complaint within thirty (30) days of receipt of the complaint. In the event that the Client is not satisfied with the resolution provided, the Client can make a complaint to the Information Commissioner at www.oaic.gov.au.",
          level: 0,
        },
      ],
    },
    {
      heading: "20. Unpaid Seller’s Rights",
      blocks: [
        {
          kind: "clause",
          marker: "20.1.",
          text: "Where the Client has left any item with HyDesign for repair, modification, exchange or for HyDesign to perform any other service in relation to the item and HyDesign has not received or been tendered the whole of any monies owing to it by the Client, HyDesign shall have, until all monies owing to HyDesign are paid:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "a lien on the item; and",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "the right to retain or sell the item, such sale to be undertaken in accordance with any legislation applicable to the sale or disposal of uncollected goods.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "20.2.",
          text: "The lien of HyDesign shall continue despite the commencement of proceedings, or judgment for any monies owing to HyDesign having been obtained against the Client.",
          level: 0,
        },
      ],
    },
    {
      heading: "21. Service of Notices",
      blocks: [
        {
          kind: "clause",
          marker: "21.1.",
          text: "Any written notice given under this contract shall be deemed to have been given and received:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "by handing the notice to the other party, in person;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "by leaving it at the address of the other party as stated in this contract;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "by sending it by registered post to the address of the other party as stated in this contract;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(d)",
          text: "if sent by facsimile transmission to the fax number of the other party as stated in this contract (if any), on receipt of confirmation of the transmission;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(e)",
          text: "if sent by email to the other party’s last known email address.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "21.2.",
          text: "Any notice that is posted shall be deemed to have been served, unless the contrary is shown, at the time when by the ordinary course of post, the notice would have been delivered.",
          level: 0,
        },
      ],
    },
    {
      heading: "22. Trusts",
      blocks: [
        {
          kind: "clause",
          marker: "22.1.",
          text: "If the Client at any time upon or subsequent to entering in to the contract is acting in the capacity of trustee of any trust (“Trust”) then whether or not HyDesign may have notice of the Trust, the Client covenants with HyDesign as follows:",
          level: 0,
        },
        {
          kind: "clause",
          marker: "(a)",
          text: "the contract extends to all rights of indemnity which the Client now or subsequently may have against the Trust and the trust fund;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(b)",
          text: "the Client has full and complete power and authority under the Trust to enter into the contract and the provisions of the Trust do not purport to exclude or take away the right of indemnity of the Client against the Trust or the trust fund. The Client will not release the right of indemnity or commit any breach of trust or be a party to any other action which might prejudice that right of indemnity.",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(c)",
          text: "The Client will not without consent in writing of HyDesign (HyDesign will not unreasonably withhold consent), cause, permit, or suffer to happen any of the following events;",
          level: 1,
        },
        {
          kind: "clause",
          marker: "(i)",
          text: "the removal, replacement or retirement of the Client as trustee of the Trust;",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(ii)",
          text: "any alteration to or variation of the terms of the Trust;",
          level: 2,
        },
        {
          kind: "clause",
          marker: "(iii)",
          text: "any advancement or distribution of capital of the Trust; or (iv) any resettlement of the trust property.",
          level: 2,
        },
      ],
    },
    {
      heading: "23. General",
      blocks: [
        {
          kind: "clause",
          marker: "23.1.",
          text: "The failure by either party to enforce any provision of these terms and conditions shall not be treated as a waiver of that provision, nor shall it affect that party’s right to subsequently enforce that provision. If any provision of these terms and conditions shall be invalid, void, illegal or unenforceable the validity, existence, legality and enforceability of the remaining provisions shall not be affected, prejudiced or impaired.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.2.",
          text: "These terms and conditions and any contract to which they apply shall be governed by the laws of Victoria in which HyDesign has its principal place of business, and are subject to the jurisdiction of the courts in Victoria.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.3.",
          text: "Subject to clause 15, HyDesign shall be under no liability whatsoever to the Client for any indirect and/or consequential loss and/or expense (including loss of profit) suffered by the Client arising out of a breach by HyDesign of these terms and conditions (alternatively HyDesign’s liability shall be limited to damages which under no circumstances shall exceed the Price of the Goods).",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.4.",
          text: "HyDesign may licence and/or assign all or any part of its rights and/or obligations under this contract without the Client’s consent.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.5.",
          text: "The Client cannot licence or assign without the written approval of HyDesign.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.6.",
          text: "HyDesign may elect to subcontract out any part of the Services but shall not be relieved from any liability or obligation under this contract by so doing.",
          level: 0,
        },
        {
          kind: "paragraph",
          text: "Furthermore, the Client agrees and understands that they have no authority to give any instruction to any of HyDesign’s sub-contractors without the authority of HyDesign.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.7.",
          text: "The Client agrees that HyDesign may amend these terms and conditions by notifying the Client in writing. These changes shall be deemed to take effect from the date on which the Client accepts such changes, or otherwise at such time as the Client makes a further request for HyDesign to provide Goods to the Client.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.8.",
          text: "Neither party shall be liable for any default due to any act of God, war, terrorism, strike, lock-out, industrial action, fire, flood, storm or other event beyond the reasonable control of either party.",
          level: 0,
        },
        {
          kind: "clause",
          marker: "23.9.",
          text: "Both parties warrant that they have the power to enter into this contract and have obtained all necessary authorisations to allow them to do so, they are not insolvent and that this contract creates binding and valid legal obligations on them.",
          level: 0,
        },
        {
          kind: "note",
          text: "© Copyright – EC Credit Control 1999 - 2021 # 35638",
        },
      ],
    },
  ],
};
