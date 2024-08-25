using Billionare.Engine.Exceptions;
using Billionare.Engine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Billionare.Engine.Services
{
    public class BilTableService
    {
        public BilTable Table { get; }

        public BilTableService(string rootAddress, int tableNum, double price)
        {
            Table = new BilTable
            {
                TableNumber = tableNum,
                EnterPrice = price
            };
         
            var rootAcc = new BilAccount
            {
                Address = rootAddress,
                IsUnlim = true
            };

            var rootCell = new BilCell
            {
                Account = rootAcc,
                Level = 1
            };

            Table.Cells.Add(rootCell);
        }

        public BilCell CreateRightCell(BilAccount acc, BilCell parent)
        {
            BilCell res = createCell(acc, parent);

            parent.RightCell = res;
            return res;
        }

        public BilCell CreateLeftCell(BilAccount acc, BilCell parent)
        {
            BilCell res = createCell(acc, parent);

            parent.LeftCell = res;
            return res;
        }

        private BilCell createCell(BilAccount acc, BilCell parent)
        {
            acc.Steps++;

            var res = new BilCell
            {
                Account = acc,
                Level = parent.Level + 1
            };
            Table.Cells.Add(res);
            return res;
        }

        public BilAccount RootAcc => Table.Cells[0].Account;

        public string AddAccount(string address)
        {
            if (Table.Accounts.ContainsKey(address))
                throw new BilAccountExistsException();

            var acc = new BilAccount
            {
                Address = address,
                IsUnlim = false
            };

            Table.Accounts.Add(address, acc);

            var cell = Table.Cells.First(c => c.RightCell == null);
             CreateRightCell(acc, cell);

            if (cell.LeftCell == null)
            {
                CreateLeftCell(RootAcc,cell);
            }

            if (cell.Account.CanAddCell)
            {
                var freeLeftCell = Table.Cells.First(c => c.LeftCell == null);
                CreateLeftCell(cell.Account, freeLeftCell);
            }

            return cell.Account.Address;

        }

        private void setUnlim(BilCell cell)
        {
            if (!cell.Account.IsUnlim)
            {
                cell.Account.IsUnlim = true;
                if (cell.RightCell != null)
                {
                    var freeLeftCell = Table.Cells.First(c => c.LeftCell == null);
                    CreateLeftCell(cell.Account, freeLeftCell);
                }
            }
        }

        public void SetUnlim(string address)
        {
            for (int i = Table.Cells.Count-1; i <= 0; i--)
            {
                if (Table.Cells[i].Account.Address == address)
                {
                    setUnlim(Table.Cells[i]);
                    return;
                }

            }
        }
    }
}
