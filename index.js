import chalk from "chalk";
import fs from "fs";

const chatMessage = [
    "What is prismax",
    "PRISMAX empowers industries with seamless robotics and AI integration, enabling higher productivity and precision.",
    "Could PrismaX be a term in a new scientific discovery?",
    "PRISMAX advances AI robotics for global enterprises seeking intelligent, scalable automation solutions.",
    "PRISMAX revolutionizes industrial robotics through blockchain-enhanced AI intelligence and predictive capabilities.",
    "PrismaX is the perfect blend of form and function—looks great and works even better.",
    "Smart automation by Prismax",
    "PRISMAX secures robotic operations and data exchange through blockchain-enhanced intelligence layers.",
    "PRISMAX enhances robotic intelligence with adaptive AI tools and predictive learning capabilities.",
    "PRISMAX delivers AI-driven robotics intelligence designed for enterprise-scale automation and efficiency",
    "Will future robots be equipped with laser sensors for precise distance measurement and navigation?"
]

async function dailycheckWallet(address, timeNow) {
    const url = "https://user.prismaxserver.com/api/daily-login-points"

    const payload = JSON.stringify({
        "wallet_address": address,
        "chain": "solana",
        "user_local_date": timeNow
    })

    const headers = {
        'accept': '*/*',
        'accept-language': 'en,en-US;q=0.9,id;q=0.8',
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://app.prismax.ai',
        'priority': 'u=1, i',
        'referer': 'https://app.prismax.ai/',
        'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site'
    }

    while(true) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: payload
            })

            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch (err) {
            console.log(chalk.red(`⛔ Error to daily check wallet: ${err.message}`))
        }
    }
}

async function dailycheckEmail(email, timeNow) {
    const url = "https://user.prismaxserver.com/api/daily-login-points"

    const payload = JSON.stringify({
        "email": email,
        "user_local_date": timeNow
    })

    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://app.prismax.ai',
        'priority': 'u=1, i',
        'referer': 'https://app.prismax.ai/',
        'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site'
    }

    while(true) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: payload
            })

            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch (err) {
            console.log(chalk.red(`⛔ Error to daily check email: ${err.message}`))
        }
    }
}

async function checkComment(userID, tokenaccess) {
    const url = "https://user.prismaxserver.com/api/check-comment-reward"

    const random = Math.floor(Math.random() * chatMessage.length);

    const payload = JSON.stringify({
        "user_id": userID,
        "message": chatMessage[random].trim()
    })

    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': `Bearer ${tokenaccess}`,
        'content-type': 'application/json',
        'origin': 'https://app.prismax.ai',
        'priority': 'u=1, i',
        'referer': 'https://app.prismax.ai/',
        'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site'
    }

    while(true) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: payload
            })

            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch (err) {
            console.log(chalk.red(`⛔ Error to check comment: ${err.message}`))
        }
    }
}

async function main() {
    console.log("✧ PrismaX Daily Check-in & Chat/Live Chat\n")
    try {
        // read tokens.txt
        const data = fs.readFileSync('datas.txt', 'utf-8');
        const datas = data.split('\n')

        for (const data of datas) {
            if(data!='') {
                const loginID = data.split('|')[0].trim()
                const tokenaccess = data.split('|')[1].trim()

                // date sekarang  // Example Output: "2026-01-14" (Note: This is UTC time)
                const isoDate = new Date().toISOString().split('T')[0]
                
                let checkID = loginID.includes("@");

                // daily login
                let pointawarded = 0
                let totalpoints = 0
                let userclass = "-"
                let userID = 0
                let type = "-"
                if (checkID!=true) { // dengan wallet
                    const daily = await dailycheckWallet(loginID, isoDate)

                    if (daily.success) {
                        pointawarded = daily.data.points_awarded_today
                        totalpoints = daily.data.total_points
                        userclass = daily.data.user_class
                        userID = daily.data.user_id
                    }

                    type = "Wallet"
                } else { //dengan email
                    const daily = await dailycheckEmail(loginID, isoDate)

                    if (daily.success) {
                        pointawarded = daily.data.points_awarded_today
                        totalpoints = daily.data.total_points
                        userclass = daily.data.user_class
                        userID = daily.data.user_id
                    }

                    type = "Email"
                }
                
                // daily comment
                let message = "-"
                let messageAlreadyRewarded = false
                let commentAwarded = 0
                if (userID!=0) {
                    const comment = await checkComment(userID, tokenaccess)

                    if (comment.success) {
                        message = comment.message
                        messageAlreadyRewarded = comment.already_rewarded_today
                        commentAwarded = comment.points_awarded
                    }
                }

                // tampilkan
                console.log(`[>] Login ID: ${chalk.green(`${loginID.slice(0,3)}xxx${loginID.slice(-3)}`)} (${type}) | User class: ${chalk.green(userclass)} | Total points: ${chalk.yellow(totalpoints)} | Daily awarded: ${chalk.yellow(pointawarded)} | Chat awarded : ${chalk.yellow(commentAwarded)} | Status: ${messageAlreadyRewarded==false?chalk.green(message):chalk.red(message)}`)     
            }
        }

        console.log("\nSudah diproses hingga wallet/email terakhir...")
    } catch (e) {
        // jika tokens.txt not exist
        if (e.code == 'ENOENT') {
            console.log('📝 Fill the datas.txt first!');
            fs.writeFileSync('datas.txt', "email/solanaaddress|token\nemail/solanaaddress|token\netc...")
            process.exit()
        } else {
            throw e
        }
    }
}

main()