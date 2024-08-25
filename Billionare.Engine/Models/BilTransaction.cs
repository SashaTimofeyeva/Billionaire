using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Models
{
    public class BilTransaction
    {
        public string AddressFrom { get; set; }

        public string AddressTo { get; set; }

        public Double Amount { get; set; }

        public string Description { get; set; }
    }
}
