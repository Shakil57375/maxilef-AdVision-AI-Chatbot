import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const ModalForFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const onClose = () => {
    const from = location.state?.from?.pathname || "/";
    navigate(-1);
  };

  const faqs = [
    {
      question: "What should I tell the AI to get the best session plan?",
      answer: `
        The more specific you are, the better the results. We encourage you to type exactly the session you want to teach, excluding no details.
        <br /><br />
        Start with these basics:
        <ul class="list-disc pl-6">
          <li>The <strong>sport</strong> you coach (e.g., soccer, basketball, etc.).</li>
          <li>The <strong>focus</strong> of your session (e.g., dribbling, fitness, defense).</li>
          <li>Your team’s <strong>age group and skill level</strong> (e.g., beginner U12 team).</li>
          <li>The <strong>duration</strong> of your session (e.g., 60 minutes).</li>
          <li>If your session has a <strong>theme</strong>, feel free to add this in as well.</li>
        </ul>
        <br />
        For example, say: 
        <ul class="list-disc pl-6">
          <li>“Plan a 1-hour soccer session for 10-year-old beginners focusing on ball control and fun.”</li>
          <li>“Plan a 45 minute gymnastics session. The average age of the gymnasts is 7 years old. Plan at least 5 different stations. Include a warm-up and cool down. The theme for the week is animals.”</li>
        </ul>
        <br />
        Alternatively, if you just want specific drill ideas to work on a specific skill, you could type: 
        <ul class="list-disc pl-6">
          <li>“Give me 5 different drills to help my gymnast achieve a back handspring. The gymnast is 10 years old and is a complete beginner.”</li>
        </ul>
      `,
    },
    {
      question: "Can I plan more than 1 session at a time?",
      answer: `
        Yes! We understand that as coaches, often you are planning multi-week or termly progressions. Simply state this in your initial message and get a multi-session plan. 
        <br /><br />
        For example: 
        <ul class="list-disc pl-6">
          <li>“Provide me with a 5-week gymnastics plan focused on achieving an up-start on bars. The gymnasts are between the ages of 10-12. Currently the gymnasts can perform a dead hang from the bar. Each session should be roughly 45 minutes in length.”</li>
        </ul>
      `,
    },
    {
      question: "What if the AI doesn't give me an appropriate session plan?",
      answer: `
        If you don't get the result you wanted, continue to ask questions until you have a session plan that works for you. 
        <br /><br />
        For example, if the results of: 
        <ul class="list-disc pl-6">
          <li>“Plan a 1-hour soccer session for 10-year-old beginners focusing on ball control and fun.”</li>
        </ul>
        were too advanced, you could type: 
        <ul class="list-disc pl-6">
          <li>“This session was too advanced for the kids I teach, please give me a session with more basic skills.”</li>
        </ul>
        <br />
        Or, if: 
        <ul class="list-disc pl-6">
          <li>“Plan a 45 minute gymnastics session. The average age of the gymnasts is 7 years old. Plan at least 5 different stations. Include a warm-up and cool down. The theme for the week is animals.”</li>
        </ul>
        gave you a result with a station including apparatus you don't have in the gym, simply say: 
        <ul class="list-disc pl-6">
          <li>“We don’t have a high bar in the gym, please provide an alternative exercise.”</li>
        </ul>
        You can go back and forth as many times as you like until you have the perfect session. Additionally, you can manually edit the response with ease in the editor by clicking the ‘Edit’ button.
      `,
    },
    {
      question: "What is Gameplan, and how can it help me as a coach?",
      answer: `
        Gameplan uses advanced AI to help sports coaches quickly plan effective training sessions for their teams. By understanding your needs—such as the age, skill level, and focus area of your players—the AI suggests drills, exercises, and session plans tailored to your goals. It saves time and ensures your sessions are engaging and productive.
      `,
    },
    {
      question: "Can I edit or customize the AI-generated session plan?",
      answer: `
        Yes! Once the AI generates your session plan, you can make adjustments. You can easily edit the response given by clicking the ‘Edit’ button located below the response. You can also ‘Pin’ the generated session plan to the specific time and date you will be coaching the session, or save the chat to a specific class.
      `,
    },
    {
      question: "Will the AI understand my coaching goals if I use simple language?",
      answer: `
        Absolutely! The AI is designed to understand everyday language. You can type instructions as simple as, “Make a fitness-focused session for teenage basketball players,” and it will know what you mean. We do encourage you to be as specific as possible but there is absolutely no need for technical or complex terms.
      `,
    },
    {
      question: "Can I use this app/website offline or on the go?",
      answer: `
        The app is designed for flexibility. While some features require an internet connection (like generating AI sessions), you can save session plans in advance to access them offline—perfect for when you're on the field or in a gym without Wi-Fi.
      `,
    },
    {
      question: "How accurate or reliable is the AI’s session planning?",
      answer: `
        The AI has been trained using vast amounts of sports coaching knowledge, best practices, and proven drills. However, it’s still a tool—you’re the expert coach! Use the AI as a helpful assistant, and feel free to adjust its suggestions to meet your team’s unique needs.
      `,
    },
    {
      question: "Is this app/website suitable for coaches at all levels?",
      answer: `
        Yes! Whether you’re a beginner coaching your child’s team or an experienced professional, the app adapts to your needs. It can provide basic drills for beginners or advanced, strategy-focused sessions for elite teams.
      `,
    },
    {
      question: "How can I save my session plans?",
      answer: `
        All your recent chats and plans with the AI are automatically saved and can be easily accessed in the ‘History’ section on the mobile app, and under ‘Recent plans’ on the website. If you want to highlight a specific chat, you can click the save button and then easily filter for this chat in the future. If you’ve set up a list of classes, you also have the ability to save the plan to a specific class of yours.
      `,
    },
    {
      question: "I have a different question, what should I do?",
      answer: `
        Please use the help and support page to contact us and our team will be happy to assist you as soon as possible. Alternatively, you can email us directly at support@gameplanai.co.uk.
      `,
    },
  ];
  

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 mx-auto dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="bg-white w-full lg:max-w-3xl p-8 rounded-lg shadow-lg relative dark:bg-gray-700 dark:text-white h-[calc(100vh-275px)] overflow-y-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <IoMdClose className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-6">FAQ</h2>

        <div className="space-y-4 max-w-3xl mx-auto dark:text-white">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-black dark:border-white rounded-lg p-8 transition-shadow duration-300 hover:shadow-lg dark:text-white"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <span className="text-2xl text-gray-500 dark:text-white">
                  {openIndex === index ? "-" : "+"}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "h-full" : "max-h-0"
                }`}
              >
                <p
                  className="mt-4 text-sm md:text-base text-gray-600 whitespace-pre-line dark:text-white"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
