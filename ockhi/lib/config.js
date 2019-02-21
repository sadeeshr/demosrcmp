module.exports = {
    "SERVER_PORT": 8090,
    "SWITCH": {
        "HOST": "switch",
        "PORT": 8021,
        "PASSWORD": "tr1ngtr1ng"
    },
    "CRYPT_ALGORITHM": "aes-256-cbc",
    "DEBUG": true,
    "BASE_DIR": "/opt/tringPhone/",
    "UPLOAD_DIR": {
        "demo.kruptoconnect.com_sounds": "/opt/kruptoconnect/sounds/demo.kruptoconnect.com/",
        "demo.kruptoconnect.com_mohs": "/opt/kruptoconnect/mohs/demo.kruptoconnect.com/",
        "demo.kruptoconnect.com_knowledgebase": "/opt/kruptoconnect/knowledgebase/demo.kruptoconnect.com/",
        "demo.kruptoconnect.com_news": "/opt/kruptoconnect/news/demo.kruptoconnect.com/",
        "demo.kruptoconnect.com_fax": "/opt/kruptoconnect/fax/demo.kruptoconnect.com/",
        "demo.kruptoconnect.com_leads": "/opt/kruptoconnect/leads/demo.kruptoconnect.com/"
    },
    "MONGODB": {
        "DB_NAME": "tringphone",
        "DB_HOST": "localhost",
        "DB_PORT": "27017"
    },
    "NOT_FOUND": {
        "document": {
            "@type": "freeswitch/xml",
            "section": {
                "@name": "result",
                "result": {
                    "@status": "not found"
                }
            }
        }
    }
}