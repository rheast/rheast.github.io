var yourData = [
    {
        data: [
            "Truth doesn't mind being questioned.",
            "A lie doesn't like being challenged."
        ],
        button: "LEARN MORE",
        head: true,
    },
    {
        title: "About",
        data: [
            "Academic freedom is a cornerstone of a democratic society. It is the freedom to pursue and disseminate knowledge without fear of censorship, retaliation, or persecution. It is the foundation upon which scientific inquiry, critical thinking, and intellectual curiosity thrive.",
            "One of the key features of academic freedom is the ability to question established beliefs and challenge existing knowledge. This is because truth does not mind being questioned. In fact, the scientific method is built on the idea of skepticism, where theories and hypotheses are constantly tested and revised in the face of new evidence.",
            "On the other hand, a lie does not like being challenged. Those who peddle falsehoods and misinformation often resort to censorship, intimidation, and violence to suppress dissent and maintain their hold on power. They fear the scrutiny of an open and free inquiry, knowing that their claims cannot stand up to scrutiny.",
            "This is why academic freedom is so important. It allows us to ask difficult questions, challenge orthodoxies, and uncover new truths. It is the engine of progress and innovation, enabling us to build a better, more just, and more equitable society."
        ],
        body: true,
        word: true,
    },
    {
        title: "Publication",
        data: [
            {
                value: "The Statistical Illusion of a Global HIV Endgame",
                time: "Mar 31, 2025",
                data: [
                    {
                        url: "img/logo/Frontiers.light.svg",
                        icon: "t-x4",
                        link: "https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1602711/"
                    }
                ]
            },
            {
                value: "Commentary on LRAs targeting NF-κB with epigenetic and mutational impacts on HIV latency",
                time: "Sep 25, 2024",
                data: [
                    {
                        url: "img/logo/wiley.light.svg",
                        link: "https://onlinelibrary.wiley.com/doi/10.1002/imo2.31"
                    }
                ]
            },
        ],
        body: true,
        list: true,
    },
    {
        title: "Other",
        data: [
            {
                value: `StaticRender ${rheast.version}`,
                time: rheast.time,
                data: [
                    {
                        url: "img/logo/GitHub_Logo.svg",
                        icon: "t-x1",
                        link: "https://github.com/rheast/rheast.github.io/tree/main/mod"
                    }
                ]
            },
            {
                value: "Space Theory",
                time: "May 09, 2021",
                data: [
                    {
                        url: "img/logo/pre.dark.png",
                        icon: "t-x2",
                        link: "https://preprints.org/manuscript/202105.0197"
                    },
                    {
                        url: "img/logo/osf.dark.png",
                        icon: "t-x1",
                        link: "https://osf.io/ze4jc"
                    }
                ]
            },
        ],
        body: true,
        list: true,
    },
    /*
    {
        title: "News",
        data: [
            {
                value: "Hearing Wrap Up: Dr. Fauci Held Publicly Accountable by Select Subcommittee",
                time: "Jun 04, 2024",
                data: [
                    {
                        url: "img/logo/house.png",
                        icon: "mh-2e t-x2 mt-5c",
                        link: "https://oversight.house.gov/release/hearing-wrap-up-dr-fauci-held-publicly-accountable-by-select-subcommittee/"
                    }
                ]
            },
            {
                value: "Stanford professor who challenged lockdowns and 'scientific clerisy' declares academic freedom 'dead'",
                time: "Nov 21, 2022",
                data: [
                    {
                        url: "img/logo/fox.light.svg",
                        link: "https://www.foxnews.com/us/stanford-professor-challenged-lockdowns-scientific-clerisy-declares-academic-freedom-dead"
                    }
                ]
            },
        ],
        body: true,
        list: true,
    },
    {
        title: "Contact",
        data: [
            {
                name: "S. Chen",
                before: "chen",
                after: "rheast.com",
                img: "img/icon/icon.dark.svg",
            },
        ],
        body: true,
        user: true,
    },
    */
    {
        data: [
            {
                link: "https://github.com/rheast",
                url: "img/logo/github.light.svg"
            },
            {
                link: "https://scholar.google.com/citations?user=di6KaxoAAAAJ",
                url: "img/logo/scholar.png"
            },
        ],
        addr: ["Rheast LLC,", "1331 Lamar St,", "Houston,", "TX 77010"],
        foot: true,
    },
]

yourData.forEach((item, i) => {
    if (i % 2 === 0) { item.color = "b_black" };
    if (item.list) { item.data.forEach(d => d.link = d.data[0].link) };
});