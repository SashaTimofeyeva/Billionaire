using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Exceptions
{
    public class BilException : Exception
    {
        public BilException(string code, string text) : base(text)
        {
            Code = code;
        }

        public string Code { get;  }
    }
}
