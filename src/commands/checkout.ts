import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import { google } from "googleapis";
import { time } from "console";

export const checkout: Command = {
    data: new SlashCommandBuilder()
        .setName("checkout")
        .setDescription("Check's you out of the CodeRED Event.")
        .addStringOption((option) =>
            option
                .setName("email")
                .setDescription("The email you entered when signing up")
                .setRequired(true)
        ),
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const { user } = interaction;
        const email = interaction.options.getString("email", true);
        var verif = false;

        // Start of googleapis stuff
        ; (async () => {
            const auth = new google.auth.JWT({
                email: "client_id",
                key: "private_key",
                scopes: ["https://www.googleapis.com/auth/spreadsheets"]
            })
            const sheet = google.sheets("v4")
            const sheetdata = await sheet.spreadsheets.values.get({
                spreadsheetId: "1jT_gUsH6_E6FYK03Apb57vpBbVgiBW0tMSCmjLsGxxs",
                auth: auth,
                range: "Sheet1!A1:D"
            })
            // console.log(user.tag);
            // console.log(sheetdata.data.values?.length);
            let rownum: number | undefined;
            rownum = sheetdata.data.values?.length;
            if (rownum != undefined) {
                for (var i = 0; i < rownum; i++) {
                    const cellDisc = sheetdata.data.values?.at(i)?.at(0);
                    if (cellDisc == user.tag) {
                        const cellEmail = sheetdata.data.values?.at(i)?.at(1);
                        if (cellEmail == email) {
                            verif = true;
                            console.log(sheetdata.data.values?.at(i)?.at(2));
                            if (sheetdata.data.values?.at(i)?.at(2) == "Checked In ✅") {
                                let dateTime = new Date();
                                await sheet.spreadsheets.values.update({
                                    spreadsheetId: "1jT_gUsH6_E6FYK03Apb57vpBbVgiBW0tMSCmjLsGxxs",
                                    auth: auth,
                                    range: "Sheet1!C" + (i + 1).toString(),
                                    valueInputOption: "RAW",
                                    requestBody: {
                                        values: [["Checked Out 🚗", dateTime.toLocaleTimeString() + " " + dateTime.toLocaleDateString()]]
                                    }
                                })

                                const checkedoutMessage = createEmbeded(
                                    "**CHECK-OUT SUCCESSFUL!** 👋",
                                    `You've checked out with ***${email}***.\nThank you for being a part of CodeRED Odyssey!`,
                                    user,
                                    client
                                ).setColor(0x00FF00);

                                console.log("SUCCESS - CHECKOUT");
                                await interaction.editReply({ embeds: [checkedoutMessage] });
                                let guild = await interaction.guild;
                                if (interaction.member != undefined) {
                                    let member = guild?.members.cache.get(interaction.member.user.id);
                                    let role = guild?.roles.cache.find(r => r.name == "Participant")
                                    if (!role) {
                                        console.log("Role Error");
                                    } else {
                                        member?.roles.remove(role);
                                    }
                                }
                                break;
                            }
                            console.log("USELESS - CHECKOUT");

                            const notcheckedinMessage = createEmbeded(
                                "**CHECK-OUT CANCELED!** ❌",
                                `You're not currently checked in with ***${email}***.\nPlease check into the event before checking out.`,
                                user,
                                client
                            ).setColor(0xFF8000);
                            await interaction.editReply({ embeds: [notcheckedinMessage] });
                            break;
                        }
                    }
                }
            }
            if (!verif) {
                const failMessage = createEmbeded(
                    "**CHECK-OUT FAILED!** ❌",
                    `The email ***${email}*** does not match our records.\nPlease make sure to enter the email you signed up with.`,
                    user,
                    client
                ).setColor(0xFF0000);
                await interaction.editReply({ embeds: [failMessage] });
                console.log("FAILURE - CHECKOUT");
            }
        })()
        // end of googleapis stuff

        return;
    },
};