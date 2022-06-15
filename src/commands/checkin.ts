import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import { google } from "googleapis";

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
        await interaction.deferReply({ ephemeral: true });
        const { user } = interaction;
        const email = interaction.options.getString("email", true);
        var verif = false;

        const successMessage = createEmbeded(
            "**You have successfully checked in!**",
            `Thank you for checking into CodeRED Odyssey!\nYour email ***${email}*** has been verified!`,
            user,
            client
        ).setColor(0x00FF00);

        const failMessage = createEmbeded(
            "**CHECK-IN FAILED**",
            `Your email ***${email}*** does not match our records.\nPlease make sure to enter the email you signed up with.`,
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
                range: "Sheet1!A1:B"
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
                            console.log("SUCCESS");
                            await interaction.editReply({ embeds: [successMessage] });
                            verif = true;
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