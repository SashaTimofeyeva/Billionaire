using Billionare.Engine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Services
{
    public class BilManager
    {
        private object lockObj { get; set; } = new object();
        public Dictionary<int, BilTableService> Tables { get; set; } = new Dictionary<int, BilTableService>();

        public List<BilTransaction> Transactions = new List<BilTransaction>();

        public void AddAccount(string address, int tableNum)
        {
            lock (lockObj)
            {
                var table = Tables[tableNum];
                var toAddress =  table.AddAccount(address);
                var transaction = new BilTransaction
                {
                    AddressFrom = address,
                    AddressTo = toAddress,
                    Amount = table.Table.EnterPrice
                };

                foreach (var t in Tables.Keys.Where(k => k < tableNum))
                    Tables[t].SetUnlim(address);

                Transactions.Add(transaction);

            }
        }

        public void AddTable(BilTableService table)
        {
            Tables.Add(table.Table.TableNumber, table);
        }
    }
}
