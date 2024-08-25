using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Models
{
    public class BilTable
    {
        private List<BilCell> cells = new List<BilCell>();

        public Dictionary<string, BilAccount> Accounts = new Dictionary<string, BilAccount>();



        public double EnterPrice { get; set; }

        public int TableNumber { get; set; }

        public List<BilCell> Cells => cells;

        //public IEnumerable<BilCell> GetFreeRightCells() => cells.Where(z => z.RightCell == null);

        //public IEnumerable<BilCell> GetFreeLeftCells() => cells.Where(z => z.LeftCell == null);

       

    }
}
