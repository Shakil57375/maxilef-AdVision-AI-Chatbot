import { FaCheck } from "react-icons/fa"

const Pricing = ({ forwardedRef }) => {
  return (
    <section ref={forwardedRef} className="py-20 px-4 bg-[#1a1b2e]">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#6366F1]">Subscriptions Plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-[#0a0b1a] border border-gray-800 rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <div className="text-3xl font-bold mb-6">
              $0<span className="text-lg font-normal text-gray-400">/30 Days</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Basic AI recommendations</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Limited campaign analysis</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Ad spend insights</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>No customized support</span>
              </li>
            </ul>

            <button className="mt-auto bg-transparent border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white px-6 py-3 rounded-md transition-colors w-full">
              Activate for free
            </button>
          </div>

          {/* Popular Plan */}
          <div className="bg-[#0a0b1a] border border-[#6366F1] rounded-lg p-6 flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 bg-[#6366F1] text-white text-center py-1 rounded-t-lg">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2 mt-6">Standard</h3>
            <div className="text-3xl font-bold mb-6">
              $22.22<span className="text-lg font-normal text-gray-400">/month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Advanced AI recommendations</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Full campaign analysis</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Budget optimization</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Email support</span>
              </li>
            </ul>

            <button className="mt-auto bg-[#6366F1] hover:bg-[#9333ea] text-white px-6 py-3 rounded-md transition-colors w-full">
              Buy now
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#0a0b1a] border border-gray-800 rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Premium</h3>
            <div className="text-3xl font-bold mb-6">
              $222.22<span className="text-lg font-normal text-gray-400">/yearly</span>
            </div>
            <div className="text-sm text-green-500 mb-4">Save $44.42</div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Everything in Standard</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Exclusive webinars & resources</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2" />
                <span>Custom strategy consultation</span>
              </li>
            </ul>

            <button className="mt-auto bg-transparent border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white px-6 py-3 rounded-md transition-colors w-full">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing

