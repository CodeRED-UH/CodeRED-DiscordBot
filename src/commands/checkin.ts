import { roleMention, SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import { google } from "googleapis";
import { time } from "console";
import { Guild, GuildMember, GuildMemberManager, GuildMemberRoleManager, Role, RoleManager } from "discord.js";

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

        const successMessage = createEmbeded(
            "**CHECK-IN SUCCESSFUL!** ✅",
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
                email: "ownerben@codered-test.iam.gserviceaccount.com",
                key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/5QI46/8OiZBs\npMutNpr0cKftvA+vxB3LvElXot3ZpuMOhttzbf47RMEijdk+ippo1XxsML/c6XCY\nZedgcrJBAFmmsDmy4ehHxtghWsqsPgirqprMOsFxWSGnRcmp6I5QecX+vZ6ASxKa\nH3wTxPKZM4bxYu/nl9TdyyJC1WF1FR8cin/CPUF+mKlsv8dUKfLEnAeN5fFeKKH2\nrSuZeGgUkHFUDxCxWPqYRFsgy4x/vPPGGtWGcSD1MCL2b1JfmhVHMyK/D/bPDVbz\ngcfvmwPLjjtRwqy05Ttdi9Y/nnoKUcj45Uq5/8ZECRAoi1OUTVDcqDnAH+z2AKc5\n/fcElfHfAgMBAAECggEAQfi2eeFQj6vlliRVzZf/T9hHM2k7L19KKxfxUwqwILrK\nRt1AJwACrlel2n5P2LuH+FCk9QERhR5QUmR+Vl84Pzaim7bsLz6RP9PxzA3Nrcep\n7XK6w0nT5WcSNdK9UQednbcvxbNlAZBNteTrIFTOXrMjSmuMNN+zFAlZHwcC+WAQ\nJtSDvoOYdE2RJGCKp0y8m02pbVNfNf5rOW1fs7WtHC9sDZhhh0Sknm92agY2p3YF\n6lK2k2oNpO8qtdTAs3cYqqtYynovC8FJypCs+N17IzLXzFwntsy+8QNafLs3GM2K\nB14a678j+20hdoVJvipHNmjdUJfEL8lmNyO4sZaCaQKBgQDg5yJzM8G4uSHJ2jKP\nGm1tZGeMBHt97rmQ+P2sfK1dSJwzpYXN7DfaMa5v+BIQYSqyHR1x1SHAleC3jDyy\n7N1cJIlCXqU+LrxFVMA8SbphDIBVGWkh4sWr/D0CCv3v+sEejMFPF/33TwABWTL5\nHhGmi/61XRQHvhCxxxhdqBl1bQKBgQDabXt4xORT1hwP6z96yWIgAKKYkTCWwYeG\ny5JfurYDT4V68jclNbQQFXWJyqCvWtzGwIlNwyQ2CYRZMKSxSMSPwdjGKoyhlaTS\n/miQBxBeM8cRXwP++e5Rz76R2Y08rFUbfOu/nqp4irIsRqClxrXzl8yvoD3vylTm\nXXrgZM0Q+wKBgQCObBB238nHzwVErHbkBJpTcgfYtWX2w9yjn+oU9wdaUYcJdcKc\nOwDLnjaXFYNq9/1vudxRn+S17rPVyGsP68vqdACwFPuTu0jipt7tzsrGdoI2Ydcf\n7Fm9pgiEaK2S8TqmvAAWtFzR5idcsz4CYDZRP8pW09DBbm1oB2q4tKEaqQKBgDRp\nvQ0XwepUIFu5iXv/QuqG/H07qbsjKVAxHSiXdwGIXXFJGe512oVZgODVnIU3em6+\n2LOuNcw5sGZug7Z+zZvpWgkDQMetTuXKYnDdIRJZvlTuxdizRHqhLQt2dquudqWn\n7jIG8sUGEwcI05ez/Qk8zcL+4p3doU299LRPu91tAoGBAI++pt7zl9YMB41RnzCg\n819UcYIMObL5uqQZaqr3skFmISrI38viUqurTZnR2mKMMO09jdnL691/w8stD59e\n8f9VdfhwyaTiw3xjw1LrjsKSBWu06t48yjbTiQ3hPJIm3FUjcItmH5wKocfmt3AQ\nTudXDjgReFlocJUOtI57ad2j\n-----END PRIVATE KEY-----\n",
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
                            if (sheetdata.data.values?.at(i)?.at(2) == "Checked In ✅") {

                                const checkedinMessage = createEmbeded(
                                    "**CHECK-IN CANCELED!** ✋",
                                    `You have already checked in with ***${email}*** at ***${sheetdata.data.values?.at(i)?.at(3)}***.\nIf this is wrong, please contact a CodeRED officer.`,
                                    user,
                                    client
                                ).setColor(0xFF8000);

                                console.log("USELESS - CHECKIN");
                                await interaction.editReply({ embeds: [checkedinMessage] });
                                return;
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
                            console.log("SUCCESS - CHECKIN");
                            await interaction.editReply({ embeds: [successMessage] });
                            let guild = await interaction.guild;
                            if (interaction.member != undefined) {
                                let member = guild?.members.cache.get(interaction.member.user.id);
                                let role = guild?.roles.cache.find(r => r.name == "Participant")
                                if(!role){
                                    console.log("Role Error");
                                } else {
                                    member?.roles.add(role);
                                }
                            }

                            return;
                        }
                    }
                }
            }
            console.log("FAILURE - CHECKIN");
            await interaction.editReply({ embeds: [failMessage] })
        })()
        // end of googleapis stuff

        return;
    },
};

// add your email
// connect with google excel and check if it's there
// if not it will say no basically
// maybe give you a role?