using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Models
{
    public class BilAccount
    {
        public Double Balance { get; set; }

        public string Address { get; set; }

        public int Steps { get; set; }

        public bool IsUnlim { get; set; }

        public bool CanAddCell => Steps < 2 || IsUnlim;
    }
}
