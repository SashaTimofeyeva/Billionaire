using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Models
{
    public class BilCell
    {
        public BilAccount Account { get; set; }

        public int Level { get; set; }

        public BilCell RightCell { get; set; }

        public BilCell LeftCell { get; set; }
    }
}
