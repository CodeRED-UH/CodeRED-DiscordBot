import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import { google } from "googleapis";
import { time } from "console";

export const checkin: Command = {
    data: new SlashCommandBuilder()
        .setName("checkin")
        .setDescription("Check's you into the CodeRED Event.")
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

        const successMessage = createEmbeded(
            "**You have successfully checked in!** ✅",
            `Thank you for checking into CodeRED Odyssey!\nYour email ***${email}*** has been verified!`,
            user,
            client
        ).setColor(0x00FF00);

        const failMessage = createEmbeded(
            "**CHECK-IN FAILED** ❌",
            `The email ***${email}*** does not match our records.\nPlease make sure to enter the email you signed up with.`,
            user,
            client
        ).setColor(0xFF0000);

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

                                const checkedinMessage = createEmbeded(
                                    "**You are already checked in!** ✋",
                                    `You have already checked in with ***${email}*** at ***${sheetdata.data.values?.at(i)?.at(3)}***.\nIf this is wrong, please contact a CodeRED officer.`,
                                    user,
                                    client
                                ).setColor(0xFFFF00);

                                console.log("USELESS");
                                await interaction.editReply({ embeds: [checkedinMessage] });
                                break;
                            }
                            let dateTime = new Date();
                            await sheet.spreadsheets.values.update({
                                spreadsheetId: "1jT_gUsH6_E6FYK03Apb57vpBbVgiBW0tMSCmjLsGxxs",
                                auth: auth,
                                range: "Sheet1!C" + (i + 1).toString(),
                                valueInputOption: "RAW",
                                requestBody: {
                                    values: [["Checked In ✅", dateTime.toLocaleTimeString() + " " + dateTime.toLocaleDateString()]]
                                }
                            })
                            console.log("SUCCESS");
                            await interaction.editReply({ embeds: [successMessage] });
                            break;
                        }
                    }
                }
            }
            if (!verif) {
                console.log("FAILURE");
                await interaction.editReply({ embeds: [failMessage] })
            }
        })()
        // end of googleapis stuff

        return;
    },
};

// add your email
// connect with google excel and check if it's there
// if not it will say no basically
// maybe give you a role?